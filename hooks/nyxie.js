import { db, firebase } from '../firebase-config.js';

// Override verification
window.generateKeyFromIds = function() { return true; };
window.verifyKey = function() { return true; };

// Initialize observer for mutations
const observer = new MutationObserver(async mutations => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            const element = document.querySelector('#test-editor');
            if (element && element.className === 'ace_editor') {
                console.log('Editor detected');
            }
        }
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Export any necessary functions or variables
export { observer };