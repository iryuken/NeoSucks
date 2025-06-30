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
            console.warn('[FakeScreenShare] getDisplayMedia not available yet. Retrying...');
            setTimeout(overrideGetDisplayMedia, 500);
            return;
        }

        navigator.mediaDevices.getDisplayMedia = async function () {
            console.log('[FakeScreenShare] Overriding display stream...');

            const canvas = document.createElement('canvas');
            canvas.width = window.screen.width;
            canvas.height = window.screen.height;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = (err) => {
                    console.error('Failed to load image:', err);
                    reject(err);
                };
            });

            let cursorX = 100, cursorY = 100;
            let dx = 2, dy = 1.5;

            const drawCursor = (ctx, x, y) => {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.stroke();
            };

            function drawFrame() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawCursor(ctx, cursorX, cursorY);

                cursorX += dx;
                cursorY += dy;

                if (cursorX < 0 || cursorX > canvas.width) dx *= -1;
                if (cursorY < 0 || cursorY > canvas.height) dy *= -1;

                requestAnimationFrame(drawFrame);
            }

            drawFrame();

            const stream = canvas.captureStream(30);
            const videoTrack = stream.getVideoTracks()[0];

            
            if (videoTrack) {
                Object.defineProperty(videoTrack, 'label', {
                    get: () => 'Primary Monitor',
                    configurable: true
                });

                videoTrack.getSettings = () => ({
                    displaySurface: 'monitor',
                    frameRate: 30,
                    width: canvas.width,
                    height: canvas.height
                });
            }

            return stream;
        };

        console.log('[FakeScreenShare] getDisplayMedia override ready.');
    }

    overrideGetDisplayMedia();
})();
    overrideGetDisplayMedia();
})();
