// ==UserScript==
// @name         image in snist ass
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces getDisplayMedia with a canvas stream using a static image (https://ryuken.neocities.org/screen.jpg)
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    const imageUrl = 'https://raw.githubusercontent.com/iryuken/NeoSucks/refs/heads/main/screen.jpg';

    function overrideGetDisplayMedia() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            console.warn('checking your ass');
            setTimeout(overrideGetDisplayMedia, 500);
            return;
        }

        navigator.mediaDevices.getDisplayMedia = async function () {
            console.log('just wait....');

            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;

            const canvas = document.createElement('canvas');
            canvas.width = screenWidth;
            canvas.height = screenHeight;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve();
                };
                img.onerror = (e) => {
                    console.error('Failed to load image into your ass:', e);
                    reject(new Error('Failed to load image at: ' + img.src));
                };
            });

            const stream = canvas.captureStream(30);
            console.log('Returning canvas stream instead of your corck');
            return stream;
        };
    }

    overrideGetDisplayMedia();
})();
