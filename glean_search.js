// Glean External Search Configuration
// Uncomment the bottom to enable.
const CONFIG = {
    BACKEND_URL: 'https://glean-public-external-be.glean.com',  // Should match your Glean external search setup
    THEME: {
        COMPACT: {
            placeholderText: "Search...",
            borderRadius: '.3125rem',
            border: '1px solid rgba(33, 50, 91, .1)',
            boxShadow: '0 .375rem 1.5rem 0 rgba(140, 152, 164, .125)',
        },
        HERO: {
            placeholderText: "Search for answers...",
            borderRadius: '.3125rem',
            border: '1px solid rgba(33, 50, 91, .1)',
            boxShadow: '0 .375rem 1.5rem 0 rgba(140, 152, 164, .125)',
        }
    },
    OPTIONS: {
        HERO: {
            fontSize: '3rem',
            verticalMargin: '80px'
        },
        COMPACT: {
            fontSize: '1.125rem',
            verticalMargin: '1rem'
        }
    },
    ELEMENTS: {
        SEARCH_BOX: 'glean-search-box',
        SEARCH_RESULTS: 'glean-search-results',
        SEARCH_BOX_RESULTS: 'glean-search-box--results'
    },
    SEARCH_TYPE: 'modal' // Specify the type of search: 'autocomplete' or 'modal'
};

// Auth Provider
class GleanAuthProvider {
    static async getToken() {
        try {
            // Create auth provider according to GuestAuthProviderOptions interface
            const authProvider = window.GleanWebSDK.createGuestAuthProvider({
                backend: CONFIG.BACKEND_URL // Required by GuestAuthProviderOptions interface
            });

            // Get token using GuestAuthProvider's getAuthToken method
            return await authProvider.getAuthToken();
        } catch (error) {
            console.error('Failed to obtain auth token:', error);
            throw error;
        }
    }
}

// Search Navigation Handler
class SearchNavigator {
    static navigateToResults(query) {
        window.location.href = `/results/?q=${encodeURIComponent(query)}`;
    }

    static getCurrentQuery() {
        return new URLSearchParams(window.location.search).get('q') || '';
    }
}

// Base Search Component
class BaseSearchComponent {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.currentQuery = '';
    }

    async initialize(token) {
        if (!this.element) return;

        try {
            await this.render(token);
        } catch (error) {
            console.error(`Failed to initialize search component: ${error.message}`);
        }
    }

    getBaseConfig(token) {
        // Following SearchBoxOptions interface
        if (CONFIG.SEARCH_TYPE === 'autocomplete') {
            return {
                authMethod: "token",
                authToken: token,
                onAuthTokenRequired: GleanAuthProvider.getToken,
                backend: CONFIG.BACKEND_URL,
                enableActivityLogging: true,
                themeVariant: 'auto',
                webAppUrl: "https://glean-public-external.glean.com",
                onSearch: (query) => {
                    console.log('Autocomplete search triggered:', query);
                }
            };
            // ModalSearchOptions
        } else if (CONFIG.SEARCH_TYPE === 'modal') {
            return {
                authMethod: "token",
                authToken: token,
                onAuthTokenRequired: GleanAuthProvider.getToken,
                backend: CONFIG.BACKEND_URL,
                enableActivityLogging: false,
                themeVariant: 'auto',
                webAppUrl: "https://glean-public-external.glean.com",
                onSearch: (query) => {
                    console.log('Modal search triggered:', query);
                }
            };
        }
    }
}

// Search Box Component
class SearchBoxComponent extends BaseSearchComponent {
    constructor(elementId) {
        super(elementId);
        this.isHero = this.element?.classList.contains('glean-search-box--hero');
        console.log(`SearchBox initialized as ${this.isHero ? 'hero' : 'compact'} search`);
    }

    async render(token) {
        const maxRetries = 3;
        const retryDelay = 500; // 500ms delay between attempts

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Render attempt ${attempt}/${maxRetries}...`);

                // Wait a moment before attempting to render
                if (attempt > 1) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }

                if (CONFIG.SEARCH_TYPE === 'autocomplete') {
                    // Ensure the container is ready for the iframe
                    this.element.style.overflow = 'visible';
                    this.element.style.zIndex = '100';

                    // Ensure required styles
                    this.element.style.position = 'relative';
                    this.element.style.display = 'block';
                    this.element.style.minHeight = '50px';
                }

                // Verify element is ready for rendering
                if (!this.element) {
                    throw new Error('Search box element not found');
                }



                const config = {
                    ...this.getBaseConfig(token),
                    searchBoxCustomizations: this.isHero ? CONFIG.THEME.HERO : CONFIG.THEME.COMPACT,
                    query: this.currentQuery,
                    onSearch: (query) => {
                        console.log('Search triggered with query:', query);
                        this.currentQuery = query;
                        if (CONFIG.SEARCH_TYPE === 'modal') {
                            this.attach(query);
                        } else {
                            SearchNavigator.navigateToResults(query);
                        }
                    }
                };


                let result; // Declare result outside the if-else blocks
                if (CONFIG.SEARCH_TYPE === 'autocomplete') {
                    result = this.isHero
                        ? await window.GleanWebSDK.renderSearchBox(this.element, config)
                        : await window.GleanWebSDK.attach(this.element, {
                            ...config,
                            themeVariant: 'auto'
                        });
                } else if (CONFIG.SEARCH_TYPE === 'modal') {
                    result = await window.GleanWebSDK.attach(this.element, {
                        ...config,
                        themeVariant: 'auto'
                    });
                }

                return result;

            } catch (error) {
                console.error(`Render attempt ${attempt} failed:`, error);

                if (attempt === maxRetries) {
                    console.error('All render attempts failed');
                    throw error;
                }
                // Otherwise continue to next attempt
            }
        }
    }

}

// Search Results Component
class SearchResultsComponent extends BaseSearchComponent {
    constructor(elementId, searchBoxId) {
        super(elementId);
        this.searchBoxElement = document.getElementById(searchBoxId);
        this.currentQuery = SearchNavigator.getCurrentQuery();
    }

    async render(token) {
        if (!this.searchBoxElement) return;

        await this.renderSearchBox(token);
        await this.renderResults(token);
    }

    async renderSearchBox(token) {
        return window.GleanWebSDK.renderSearchBox(this.searchBoxElement, {
            ...this.getBaseConfig(token),
            searchBoxCustomizations: CONFIG.THEME.HERO,
            query: this.currentQuery,
            backend: CONFIG.BACKEND_URL,
            onSearch: (query) => {
                this.currentQuery = query;
                this.renderResults(token);
            }
        });
    }

    async renderResults(token) {
        return window.GleanWebSDK.renderSearchResults(this.element, {
            ...this.getBaseConfig(token),
            query: this.currentQuery,
            backend: CONFIG.BACKEND_URL,
            onSearch: (query) => {
                this.currentQuery = query;
                this.renderSearchBox(token);
            }
        });
    }
}

// Glean SDK Manager
class GleanSDKManager {
    static async initialize() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Add a small delay after DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log("Initializing Glean Search...");

        try {
            // Ensure GleanWebSDK is fully loaded
            if (!window.GleanWebSDK) {
                throw new Error('GleanWebSDK not found');
            }

            // Wait a moment for SDK to be fully initialized
            await new Promise(resolve => setTimeout(resolve, 100));

            const token = await GleanAuthProvider.getToken();

            // Initialize search box if present
            const searchBox = new SearchBoxComponent(CONFIG.ELEMENTS.SEARCH_BOX);
            await searchBox.initialize(token);

            // Initialize search results if present
            const searchResults = new SearchResultsComponent(
                CONFIG.ELEMENTS.SEARCH_RESULTS,
                CONFIG.ELEMENTS.SEARCH_BOX_RESULTS
            );
            await searchResults.initialize(token);

            console.log("Glean Search initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Glean Search:", error);
        }
    }
}

// Uncomment this to enable Glean search.
// TODO: As react is used, current implementation only triggers search modal once (page only loads once). Need to fix.
// (() => {
//     // Wait for both Glean SDK and DOM to be ready
//     const initializeWhenReady = () => {
//         if (window.GleanWebSDK) {
//             GleanSDKManager.initialize();
//         } else {
//             window.addEventListener("glean:ready", GleanSDKManager.initialize);
//         }
//     };

//     // If DOM is not ready, wait for it
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initializeWhenReady);
//     } else {
//         initializeWhenReady();
//     }
// })();