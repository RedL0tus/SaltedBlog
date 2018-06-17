/* 
 * Get URL parameters
 * https://html-online.com/articles/get-url-parameters-javascript/
 */
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
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

function renderPost(meta, id) {
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
            }
        }
    }
}

function renderIndex(meta) {
    if (meta != null) {
        document.getElementById("title").innerText = meta.title;
        document.title = meta.title;
        for (let i = 0; i < meta.posts.length; i += 1) {
            document.getElementById("postsIndex").innerHTML += "<li><a href=\"post.html?post=" + meta.posts[i].id + "\">" + meta.posts[i].title + "</a></li>";
        }
    }
}

/* Main */
function main() {
    let post = getUrlParam("post", "index");
    if (post != "index") {
        getMeta("meta.json").then(meta => renderPost(meta, post));
    } else {
        getMeta("meta.json").then(meta => renderIndex(meta));
    }
}

main()