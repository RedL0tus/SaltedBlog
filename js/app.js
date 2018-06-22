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
let getManifest = function() {
    return new Promise((resolve, reject) => {
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i += 1) {
            if (links[i].getAttribute("rel") === "manifest") {
                resolve(links[i].getAttribute("href"))
            }
        }
        reject("No manifest found")
    })
};

/* 
 * Get URL parameters
 * https://html-online.com/articles/get-url-parameters-javascript/
 */
function getUrlParam(parameter, defaultvalue) {
    return new Promise((resolve) => {
        if (window.location.href.indexOf(parameter) > -1) {
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                if (key === parameter) {
                    resolve(value)
                }
            });
        }
        resolve(defaultvalue)
    })
};

function addToQuery(tag, content) {
    return new Promise(() => {
        QUERY.push({ "tag": tag, "content": content });
    })
}

function replaceContent(tag, content) {
    return new Promise(() => {
        let re = new RegExp(tag, 'g');
        document.documentElement.innerHTML = document.documentElement.innerHTML.replace(re, content);
    });
}

(async function(){
    const MANIFEST = await getManifest();
    document.addEventListener("DOMContentLoaded", function() {
        for (let i = 0; i < QUERY.length; i += 1) {
            replaceContent(QUERY[i].tag, QUERY[i].content);
        }
    })
})(); 