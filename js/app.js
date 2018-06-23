/*
 * SaltedBlog main JavaScript file
 * Copyleft 2018 KayMW <RedL0tus@noreply.github.io>
 * Licensed under the terms of GPLv3
 */

"use strict";

let QUERY = new Array();

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

function clearQuery() {
    return new Promise(() => {
        for (let i = 0; i < QUERY.length; i += 1) {
            document.documentElement.innerHTML = Mustache.render(document.documentElement.innerHTML, QUERY[i]);
        }
    })
}

async function addToQuery(object) {
    QUERY.push(object);
    if (document.readyState === "complete") {
        await clearQuery();
    }
}

function renderContent(url) {
    return new Promise(resolve => {
        fetch(url)
            .then(text => text.text())
            .then(function(text) {
                let converter = new showdown.Converter();
                resolve(converter.makeHtml(text));
            })
            .catch(error => console.log("Error while downloading post: " + error));
    })
}

(async function(){
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
                        if (post != null) {
                            if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).includes(manifest.index)) {
                                window.location.href = window.location.href.replace(manifest.index, manifest.post);
                            }
                            for (let i = 0; i < meta.posts.length; i += 1) {
                                if (meta.posts[i].id === post) {
                                    let info = meta.posts[i];
                                    info.content = await renderContent(info.file);
                                    addToQuery(info);
                                    break;
                                }
                            }
                        } else {
                            let index = manifest;
                            index.posts = [];
                            for (let i = 0; i < meta.posts.length; i += 1) {
                                index.posts[i] = meta.posts[i];
                                index.posts[i].link = manifest.post + "?post=" + index.posts[i].id;
                            }
                            addToQuery(index);
                        }
                    })
                    .catch(error => "Error while fetching posts meta: " + error);
            })
            .catch(error => console.log("Error while fetching manifest: " + error));
        console.log("Done.");
    }
    document.addEventListener("DOMContentLoaded", function() {
        clearQuery();
    });
})(); 