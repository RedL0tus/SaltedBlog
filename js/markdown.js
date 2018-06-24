"use strict";

define(['https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js'], function(showdown) {
    return {
        info: {
            description: "Markdown renderer (showdown)"
        },
        render: function(text) {
            let converter = new showdown.Converter();
            return converter.makeHtml(text)
        }
    }
});