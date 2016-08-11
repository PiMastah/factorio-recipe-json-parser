# Factorio Recipes as JSON

## Installation

Clone this repository and run

	npm install

to install dependencies.

## Usage

	Usage: src/index.js [options]

	Options:
	  -d, --dir   the directory to parse recipes from, defaults to current working
	              directory if omitted
	  -h, --help  Show help                                                [boolean]

	Examples:
	  src/index.js -d ../recipe/  parse the recipes in that folder

	copyright 2016 pimastah@gmail.com https://github.com/PiMastah


## Output

Output currently goes to STDOUT.

If you require programmatic integration possibilities, fork this repository and send me a pull request or create a ticket describing your needs.

Sample output can be found [here](https://github.com/PiMastah/factorio-recipe-json-parser/blob/master/0.13.15%20sample%20output.json).

## Stability

Tested with Factorio 0.13.15. Expect bugs when testing with mods. Currently, zip files are not supported. Create a ticket if you would like to have mod archives supported directly.

*Please create a ticket if you encounter errors. Provide the file(s) you tried to parse. Provide your Factorio and mod version where applicable and/or attach mod archives to the ticket directly.*

**If errors cannot be reproduced, they most likely cannot be fixed.**
