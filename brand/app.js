// Prevent local links from opening in new tabs
document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (target && target.getAttribute('href').startsWith('/') && target.target === '_blank') {
        target.removeAttribute('target');
    }
}, true);


const deprecatedWarningText = "This endpoint is deprecated and may be removed at anytime. Please use the new endpoint instead.";
const deprecatedPaths = [
    "/api-reference/setup",
    "/api-reference/troubleshooting/get-user-count",
    "/api-reference/troubleshooting/get-document-count",
    "/api-reference/troubleshooting/get-document-upload-and-indexing-status",
    "/api-reference/people/bulk-index-employees-1",
    "/api-reference/answers/create-answer-board",
    "/api-reference/answers/delete-answer-board",
    "/api-reference/answers/update-answer-board",
    "/api-reference/answers/read-answer-board"
];

// Add deprecated warning
function addDeprecatedWarning() {
    const canonicalLink = document.querySelector('head link[rel="canonical"]');

    if (canonicalLink) {
        const url = new URL(canonicalLink.href);
        if (deprecatedPaths.some(path => url.pathname.includes(path))) {
            document.body.classList.add("deprecated");

            const header = document.querySelector('header');
            if (header) {
                const warningDiv = document.createElement('div');
                warningDiv.className = "callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border border-amber-500/20 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/10";
                warningDiv.setAttribute("data-callout-type", "warning");
                warningDiv.innerHTML = `<div class="mt-0.5 w-4"><svg class="flex-none w-5 h-5 text-amber-400 dark:text-amber-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-label="Warning"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="text-sm prose min-w-0 w-full text-amber-900 dark:text-amber-200">${deprecatedWarningText}</div>`;
                header.insertAdjacentElement('afterend', warningDiv);
            }
        }
    }
}

// Listen for route changes and update the document title
window.next.router.events.on('routeChangeComplete', addDeprecatedWarning);
addDeprecatedWarning();
