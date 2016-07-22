// Original version svg2png: https://www.npmjs.com/package/svg2png
// 
"use strict";

/* global phantom: true */

var webpage = require("webpage");
var system = require("system");

var PREFIX = "data:image/svg+xml;base64,";

if (system.args.length !== 2) {
    console.error("Usage: converter.js resize");
    phantom.exit();
} else {
    convert(system.args[1]);
}

function convert(resize) {
    var page = webpage.create();
    var sourceBase64 = system.stdin.readLine();

	try {
		if (resize !== "undefined") {
			resize = JSON.parse(resize);
			setSVGDimensions(page, resize.width, resize.height);
		}
		/*
		var dimensions = getSVGDimensions(page);
		if (!dimensions) {
			console.error("Width or height could not be determined from either the source file or the supplied " +
						  "dimensions");
			phantom.exit();
			return;
		}

		page.viewportSize = {
			width: dimensions.width,
			height: dimensions.height
		};
		*/
	} catch (e) {
		console.error("Unable to calculate or set dimensions.");
		console.error(e);
		phantom.exit();
		return;
	}
	
	// var html = "<html><head/><body><h2>Demo</h2><img src=\"" + PREFIX + sourceBase64 + "\"/><!-- " + sourceBase64 + "--></body>";
	var html = sourceBase64;
	
	
	page.onLoadFinished = function(success){
		var result = "data:image/png;base64," + page.renderBase64("PNG");
		system.stdout.write(result);
		phantom.exit();
	}
    //like this
    page.content = html;
    
	  
	/*
    page.open("<html><head/><body><img src=\"" + PREFIX + sourceBase64 + "\"/></body>", function (status) {
        if (status !== "success") {
            console.error("Unable to load the source file.");
            phantom.exit();
            return;
        }
		
        var result = "data:image/png;base64," + page.renderBase64("PNG");
        system.stdout.write(result);
        phantom.exit();
    });
	*/
}

function setSVGDimensions(page, width, height) {

	page.viewportSize = {
		width: width,
		height: height
	};
}

function old(){
    if (width === undefined && height === undefined) {
        return;
    }

    return page.evaluate(function (width, height) {
        /* global document: true */
        var el = document.documentElement;

        if (width !== undefined) {
            el.setAttribute("width", width + "px");
        } else {
            el.removeAttribute("width");
        }

        if (height !== undefined) {
            el.setAttribute("height", height + "px");
        } else {
            el.removeAttribute("height");
        }
    }, width, height);
}

function getSVGDimensions(page) {
    return page.evaluate(function () {
        /* global document: true */

        var el = document.documentElement;

        var widthIsPercent = /%\s*$/.test(el.getAttribute("width") || ""); // Phantom doesn't have endsWith
        var heightIsPercent = /%\s*$/.test(el.getAttribute("height") || "");
        var width = !widthIsPercent && parseFloat(el.getAttribute("width"));
        var height = !heightIsPercent && parseFloat(el.getAttribute("height"));

        if (width && height) {
            return { width: width, height: height };
        }

        var viewBoxWidth = el.viewBox.animVal.width;
        var viewBoxHeight = el.viewBox.animVal.height;

        if (width && viewBoxHeight) {
            return { width: width, height: width * viewBoxHeight / viewBoxWidth };
        }

        if (height && viewBoxWidth) {
            return { width: height * viewBoxWidth / viewBoxHeight, height: height };
        }

        return null;
    });
}
