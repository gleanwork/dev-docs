// Prevent local links from opening in new tabs
document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (target && target.getAttribute('href').startsWith('/') && target.target === '_blank') {
        target.removeAttribute('target');
    }
}, true);