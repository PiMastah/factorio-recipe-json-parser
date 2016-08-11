'use strict';

let fs = require('fs');
let path = require('path');
let when = require('when');
let args = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -d ../recipe/', 'parse the recipes in that folder')
	.alias('d', 'dir')
	.nargs('d', 1)
	.describe('d', 'the directory to parse recipes from, defaults to current working directory if omitted')
	.help('h')
	.alias('h', 'help')
	.epilog('copyright 2016 pimastah@gmail.com https://github.com/PiMastah')
	.argv;

let cwd = process.cwd();
let dir = args.dir || args.d || '.';

if (dir.substr(-1) !== path.sep) {
	dir += path.sep;
}

fs.readdir(path.normalize(cwd+path.sep+dir), function (err, files) {
	if (err) {
		console.error(err);
		process.exit(0);
	}

	let filteredFiles = files.filter(function (filename) {
		return filename.substr(-4) === '.lua';
	});

	if (filteredFiles.length === 0) {
		console.error(new Error('No .lua files found. Please see "-h" option for usage instructions.'));
		process.exit(0);
	}

	var promiseArray = filteredFiles.map(function (filename) {
		return when.promise(function(resolve, reject, notify) {
			fs.readFile(dir+filename, {encoding: "utf-8"}, function (err, content) {
				if (err) {
					reject(filename+' '+err);
				}

				let currentLevel = 0;

				let fixedContent = content.split('\n').filter(function (line) {
					return line !== '';
				}).filter(function (line, index) {
					return index > 0 && line !== ')'
				});

				fixedContent[fixedContent.length-1] = '}';

				fixedContent = fixedContent.map(function (line) {
					let fixedLine = line;
					fixedLine = fixedLine.replace(/[{}]/g, function (match) {
						if ('{' === match) {
							currentLevel++;
							return 1 === currentLevel % 2 ? '[' : '{';
						}
						if ('}' === match) {
							currentLevel--;
							return 0 === currentLevel % 2 ? ']' : '}';
						}
					});
					fixedLine = fixedLine.replace(/("\S*")[ ]*,[ ]*(\d{1,})/g, "$1: $2");
					fixedLine = fixedLine.replace(/(\S*)[ ]*=[ ]*("?\S*"?)/g, "$1: $2");

					return fixedLine;
				}).join('\n');

				resolve(eval(fixedContent));
			});
		});
	});

	when.all(promiseArray).then(function (results) {
		var result = Array.prototype.concat.apply([], results).map(function (recipe) {
			if (recipe && recipe.ingredients) {
				recipe.ingredients = Object.assign.apply({}, recipe.ingredients);
			};
			return recipe;
		});

		console.log(JSON.stringify(result));
	});
});