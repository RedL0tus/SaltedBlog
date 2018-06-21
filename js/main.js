/*
 * SaltedBlog main JavaScript file
 * Copyleft 2018 KayMW <RedL0tus@noreply.github.io>
 * Licensed under the terms of GPLv3
 */

const CONFIG = "config.json";

/* 
 * Get URL parameters
 * https://html-online.com/articles/get-url-parameters-javascript/
 */
function getUrlParam(parameter, defaultvalue) {
    let urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            if (key === parameter) {
                urlparameter = value;
            }
        });
    }
    return urlparameter;
}

function getMeta(url) {
    return fetch(url)
        .then(function(data) {
            return data.json();
        })
        .catch(function(error) {
            console.log("Error while fetching meta: " + error);
            return null;
        });
}

function getPost(url) {
    return fetch(url)
        .then(function(data) {
            return data.text();
        })
        .catch(function(error) {
            console.log("Failed to fetch post content: " + error);
            document.getElementById("content").innerHTML = "<p>Failed to fetch post content: " + error + "</p>";
        });
}

function showPost(config, id) {
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1).includes(config.index)) {
        window.location.href = window.location.href.replace(config.index, config.post);
    }
    getMeta(config.meta)
        .then(function(meta){
            if (meta != null) {
                for (let i = 0; i < meta.posts.length; i += 1) {
                    if (meta.posts[i].id === id) {
                        document.title = meta.posts[i].title;
                        document.getElementById("title").innerText = meta.posts[i].title;
                        document.getElementById("date").innerText = meta.posts[i].date;
                        getPost(meta.posts[i].file)
                            .then(function(text) {
                                var converter = new showdown.Converter(),
                                    html      = converter.makeHtml(text);
                                document.getElementById("content").innerHTML = html;
                            });
                        break;
                    }
                }
            }
        });
}

function showIndex(config) {
    if (config != null) {
        document.getElementById("title").innerText = config.title;
        document.title = config.title;
        getMeta(config.meta).then(function(meta) {
            if (meta.posts.length > 0) {
                document.getElementById("postsIndex").innerHTML = "";
                for (let i = 0; i < meta.posts.length; i += 1) {
                    document.getElementById("postsIndex").innerHTML += "<li><a href=\""+ config.post + "?post=" + meta.posts[i].id + "\">" + meta.posts[i].title + "</a></li>";
                }
            } else {
                document.getElementById("postsIndex").innerHTML = "<p>Nothing yet.</p>";
            }
        });
    }
}

/* Main */
function main() {
    let post = getUrlParam("post", "index");
    if (post != "index") {
        getMeta(CONFIG).then(config => showPost(config, post));
    } else {
        getMeta(CONFIG).then(config => showIndex(config));
    }
}

main();