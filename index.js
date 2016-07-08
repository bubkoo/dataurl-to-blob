module.exports = function (dataURL) {

    'use strict';

    if (!window || window.window !== window) {
        throw new Error('This module is only available in browser');
    }

    var Blob = window.Blob || window.MozBlob || window.WebKitBlob;
    if (!Blob) {
        throw new Error('Blob was not supported');
    }

    var dataURLPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/;

    // parse the dataURL components as per RFC 2397
    var matches = dataURL.match(dataURLPattern);
    if (!matches) {
        throw new Error('invalid dataURI');
    }

    // default to text/plain;charset=utf-8
    var mediaType = matches[2]
        ? matches[1]
        : 'text/plain' + (matches[3] || ';charset=utf-8');

    var isBase64   = !!matches[4];
    var dataString = dataURL.slice(matches[0].length);
    var byteString = isBase64
        // convert base64 to raw binary data held in a string
        ? atob(dataString)
        // convert base64/URLEncoded data component to raw binary
        : decodeURIComponent(dataString);

    var array = [];
    for (var i = 0; i < byteString.length; i++) {
        array.push(byteString.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: mediaType });
};

