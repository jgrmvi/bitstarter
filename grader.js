#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLDEFAULT = "http://floating-woodland-5410.herokuapp.com/";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var urlExists = function(url) {
    var instr = url.toString();
    rest.get(url).on('error', function(err, response) {
	if (err instanceof Error) {
	console.log("Error, url doesn't exists: " + response);
	process.exit(1);
	}
    });
    return instr;
};

var cheerioHtmlFile = function(htmlContent) {
    return cheerio.load(htmlContent);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlContent, checksfile) {
    $ = cheerioHtmlFile(htmlContent);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
	.option('-u, --url <url_reference>', 'Url reference', clone(urlExists))
	.parse(process.argv);
    if (program.file) {
	var checkJson = checkHtmlFile(fs.readFileSync(program.file), program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
    else if (program.url) {
	rest.get(program.url).once('complete', function(data) {
	if (data instanceof Error) {
	sys.puts('Error: ' + result.message);
	} else {
//	console.log(result);
	var checkJson = checkHtmlFile(data, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
	}
	});
    }
    else {
	console.log('Error: invalid args, for help grader.js --help');
    }

} else {
    exports.checkHtmlFile = checkHtmlFile;
}
