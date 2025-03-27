/*************************************************************************
 * Mintlify Slow Banner Overrides
 *
 * Some OpenAPI endpoints are slow and may take a long time to respond.
 * This script adds a banner to slow endpoints while Mintlify works on a fix.
 *************************************************************************/
document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    if (href.startsWith('/client/api')) {
        document.body.classList.add('slow');
    } else {
        document.body.classList.remove('slow');
    }
});