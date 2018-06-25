/*
 * SaltedBlog main JavaScript file
 * Copyleft 2018 KayMW <RedL0tus@noreply.github.io>
 * Licensed under the terms of GPLv3
 */
(function(){
    let SaltedBlog = {};
    SaltedBlog.START = new Event('SaltedBlogStart');
    SaltedBlog.DONE = new Event('SaltedBlogDone');
    SaltedBlog.QUEUE = new Array();

    /*
     * Find manifest
     * https://stackoverflow.com/a/11708432
     */
    function getManifest() {
        return new Promise((resolve, reject) => {
            var links = document.getElementsByTagName("link");
            for (var i = 0; i < links.length; i += 1) {
                if (links[i].getAttribute("rel") === "manifest") {
                    resolve(links[i].getAttribute("href"))
                }
            }
            reject("No manifest found")
        })
    }
    
    /* 
     * Get URL parameters
     * https://html-online.com/articles/get-url-parameters-javascript/
     */
    function getUrlParam(parameter) {
        return new Promise((resolve) => {
            if (window.location.href.indexOf(parameter) > -1) {
                window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    if (key === parameter) {
                        resolve(value)
                    }
                });
            }
            resolve(null)
        })
    }
    
    function clearQueue() {
        return new Promise(() => {
            for (let i = 0; i < SaltedBlog.QUEUE.length; i += 1) {
                require(["https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js"], function(Mustache){
                    document.documentElement.innerHTML = Mustache.render(document.documentElement.innerHTML, SaltedBlog.QUEUE[i]);
                    document.dispatchEvent(SaltedBlog.DONE);
                });
            }
        })
    }
    
    async function addToQueue(object) {
        SaltedBlog.QUEUE.push(object);
        if (document.readyState === "complete") {
            await clearQueue();
        }
    }
    
    function renderContent(url, type) {
        return new Promise(resolve => {
            fetch(url)
                .then(text => text.text())
                .then(function(text) {
                    require([type], function(renderer) {
                        console.log("Rendering using: " + renderer.info.description);
                        resolve(renderer.render(text))
                    });
                })
                .catch(error => console.log("Error while rendering post: " + error));
        })
    }

    SaltedBlog.start = async function(){
        document.dispatchEvent(SaltedBlog.START);
        const MANIFEST = await getManifest();
        if (MANIFEST) {
            console.log("Manifest set to " + MANIFEST);
            fetch(MANIFEST)
                .then(manifest => manifest.json())
                .then(async function(manifest) {
                    let post = await getUrlParam("post");
                    fetch(manifest.meta)
                        .then(meta => meta.json())
                        .then(async function(meta) {
                            let info = {};
                            if (window.location.pathname
                                    .substring(window.location.pathname.lastIndexOf('/') + 1)
                                    .includes(manifest.modeSettings.index) 
                                && (post != null)
                                && (manifest.modeSettings.redirect === true)) {
                                window.location.href = window.location.href
                                    .replace(manifest.modeSettings.index, manifest.modeSettings.post);
                            }
                            Object.assign(info, manifest);
                            info.index = info.modeSettings.index;
                            info.post = info.modeSettings.post;
                            info.posts = [];
                            for (let i = 0; i < meta.posts.length; i += 1) {
                                info.posts[i] = meta.posts[i];
                                info.posts[i].link = manifest.modeSettings.post + "?post=" + info.posts[i].id;
                                if (meta.posts[i].id === post) {
                                    Object.assign(info, meta.posts[i]);
                                    info.content = await renderContent(info.file, info.type);
                                }
                            }
                            addToQueue(info);
                        })
                        .catch(error => "Error while fetching posts meta: " + error);
                })
                .catch(error => console.log("Error while fetching manifest: " + error));
        }
        document.addEventListener('DOMContentLoaded', function() {
            clearQueue();
        })
        document.onreadystatechange = function() {
            if (document.readyState === "complete") {
                clearQueue();
            } else {
                console.log("Document not loaded")
            }
        }
    }

    let root = this;
    if (typeof define === 'function' && define.amd) {
        define(function () {
        'use strict';
        SaltedBlog.start();
        return SaltedBlog;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = SaltedBlog;
        SaltedBlog.start();
    } else {
        root.SaltedBlog = SaltedBlog;
        SaltedBlog.start();
    }
}).call(this);