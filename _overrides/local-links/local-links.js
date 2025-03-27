/*************************************************************************
 * Mintlify Local Link Overrides
 *
 * Mintlify assumes all pages that use "url" metadata are external links.
 * This script prevents local links from opening in new tabs.
 *************************************************************************/

document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    // Check if the link is a local link and has a target attribute
    if (href.startsWith('/') && target.target === '_blank') {
        target.removeAttribute('target');
    }

    // Check if href ends with /[type]/openapi and redirect to the appropriate OAS URL
    const openapiMatch = href.match(/\/([^\/]+)\/openapi$/);
    if (openapiMatch) {
        const type = openapiMatch[1];
        target.setAttribute('href', `/oas/${type}`);
        target.setAttribute('target', '_blank');
    }
}, true);