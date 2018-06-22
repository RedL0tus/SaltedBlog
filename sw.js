/*
 * Service Worker with sw-toolbox
 */

"use strict";
(function(){
    const CONFIG = "config.json";
    let cacheVersion = "20180622";
    let staticImageCacheName = "image-" + cacheVersion;
    let staticAssetsCacheName = "assets-" + cacheVersion;
    let contentCacheName = "content-" + cacheVersion;
    let vendorCacheName = "vendor-" + cacheVersion;
    let maxEntries = 100;

    // Import sw-toolbox
    self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js");
    self.toolbox.options.debug = false;
    self.toolbox.options.networkTimeoutSeconds = 1;

    // Fetch config
    fetch(CONFIG).then(config => config.json()).then(function(config) {
        /* Image caching */
        if (config.img != null) {
            self.toolbox.router.get(config.img, self.toolbox.cacheFirst, {
                origin: config.link,
                cache: {
                    name: staticImageCacheName,
                    maxEntries: maxEntries
                }
            });
        }
        /* Image hosts other than host itself */
        if (config.imgHosts.length > 0) {
            for (let i = 0; i < config.imgHosts.length; i += 1) {
                self.toolbox.router.get(config.imgHosts[i].path, self.toolbox.cacheFirst, {
                    origin: config.imgHosts[i].host,
                    maxEntries: maxEntries
                });
            }
        }

        let parser = document.createElement('a');
        parser.href = config.link;
        if (parser.pathname.endsWith("/")) {
            let metaPath = parser.pathname + config.meta;
            let configPath = parser.pathname + CONFIG;
        } else {
            let metaPath = parser.pathname + "/" + config.meta;
            let configPath = parser.pathname + "/" + CONFIG;
        }

        /* Caching post meta */
        if (config.meta != null) {
            self.toolbox.router.get(metaPath, self.toolbox.networkFirst, {
                origin: parser.hostname,
                maxEntries: maxEntries
            });
        }

        self.toolbox.router.get(configPath, self.toolbox.networkFirst, {
            origin: parser.hostname,
            maxEntries: maxEntries
        })
    });
})();