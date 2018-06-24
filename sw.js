/*
 * Service Worker with Workbox
 */

"use strict";
(function(){
    let cacheVersion = "20180624";
    let staticImageCacheName = "image-" + cacheVersion;
    let staticAssetsCacheName = "assets-" + cacheVersion;
    let contentCacheName = "content-" + cacheVersion;
    let vendorCacheName = "vendor-" + cacheVersion;
    let maxEntries = 100;

    /* Import Workbox */
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

    if (workbox) {
        /* Caching JS files */
        workbox.routing.registerRoute(
            new RegExp('.*\.js'),
            workbox.strategies.staleWhileRevalidate({
                cacheName: staticAssetsCacheName
            })
        );
        /* Caching JSON metas and Markdown posts */
        workbox.routing.registerRoute(
            new RegExp('.*\.(json|md|markdown)'),
            workbox.strategies.staleWhileRevalidate({
                cacheName: contentCacheName
            })
        );
        /* Caching HTML files */
        workbox.routing.registerRoute(
            new RegExp('.*\.(html|htm)'),
            workbox.strategies.cacheFirst({
                cacheName: staticAssetsCacheName,
                plugins: [
                    new workbox.expiration.Plugin({
                        maxAgeSeconds: 7 * 24 * 60 * 60
                    })
                ]
            })
        );
        /* Caching Images */
        workbox.routing.registerRoute(
            new RegExp('.*\.(?:png|jpg|jpeg|svg|gif|webp)'),
            workbox.strategies.cacheFirst({
                cacheName: staticImageCacheName,
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: maxEntries,
                        maxAgeSeconds: 7 * 24 * 60 * 60
                    })
                ]
            })
        );
        /* Google Fonts */
        workbox.routing.registerRoute(
            new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
            workbox.strategies.cacheFirst({
                cacheName: vendorCacheName,
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: maxEntries,
                    }),
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200]
                    }),
                ],
            }),
        );

        /* Google Analytics */
        // workbox.googleAnalytics.initialize();
    }
})();