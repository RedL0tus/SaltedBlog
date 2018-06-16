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

/* Main */
function main() {
    let post = getUrlParam("post", "index");
    if(post != "index") {
        getMeta("meta.json").then(meta);
        console.log("Meta: " + meta);
        if (meta != null) {
            for (let i = 0; i < meta.posts.length; i += 1) {
                if (meta.posts[i].link === post) {
                    console.log("Post title: " + meta.posts[i].title);
                }
            }
        }
    }
    console.log("post set to " + post);
}

main()