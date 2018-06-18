/*
 * SaltedBlog main JavaScript file
 * Copyleft 2018 KayMW <RedL0tus@noreply.github.io>
 * Licensed under the terms of GPLv3
 */

const INDEX = "index.html";
const POST  = "post.html";
const META  = "meta.json";

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

function showPost(meta, id) {
    if (meta != null) {
        for (let i = 0; i < meta.posts.length; i += 1) {
            if (meta.posts[i].id === id) {
                document.title = meta.posts[i].title;
                document.getElementById("title").innerText = meta.posts[i].title;
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
}

function showIndex(meta) {
    if (meta != null) {
        document.getElementById("title").innerText = meta.title;
        document.title = meta.title;
        for (let i = 0; i < meta.posts.length; i += 1) {
            document.getElementById("postsIndex").innerHTML += "<li><a href=\""+ POST + "?post=" + meta.posts[i].id + "\">" + meta.posts[i].title + "</a></li>";
        }
    }
}

/* Main */
function main() {
    let post = getUrlParam("post", "index");
    if (post != "index") {
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1).includes(INDEX)) {
            window.location.href = window.location.href.replace(INDEX, POST);
        }
        getMeta(META).then(meta => showPost(meta, post));
    } else {
        getMeta(META).then(meta => showIndex(meta));
    }
}

main()