const convert = require('xml-js');
const fs = require('fs')
const inquirer = require('inquirer')

fileList = [];

let files = fs.readdirSync('input/')

files.forEach((file) => {
	if (RegExp('.*\.xml').test(file)) {
		fileList.push(file)
	}

})

inquirer.prompt([{
	type: "checkbox",
	message: "Which file(s) would you like to process? (/input)",
	name: "file",
	choices: fileList
}, 
{
	type: "checkbox",
	message: "What types would you like to retrieve?",
	name: "type",
	choices: [
		"Items",
		"Monsters"
	]
}]).then((data) => {
	console.log(data)
})




function convertXML(filename, callback) {
	fs.readFile('./' + filename, function(e,data) {
		if(e) {
			callback(e);
		}

		var json = JSON.parse(convert.xml2json(data, {compact: true, spaces: 4}));

		callback(null, json);
	})
}

function getMonsters(filename, callback) {
	var monsters,
		result = [];

	convertXML(filename, function(e,data) {
		if (e) {
			callback(e);
		}

		monsters = data.compendium.monster;

		for (var i = 0; i < monsters.length; i++) {
			var card = {
				"count": 1,
			    "color": "",
			    "title": "",
			    "icon": "",
			    "contents": [],
			    "tags": ["monster"]
			}
			var monster = monsters[i];

			card.color = "black";
			card.title = monster.name._text;

			if (filename == 'Book_of_Beautiful_Horrors.xml') {
				card.tags.push('bh');
			}
			
			if (RegExp(".*aberration.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "moon-claws";
				card.tags.push("aberration");
			} else if (RegExp(".*beast.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "beast-eye";
				card.tags.push("beast");
			} else if (RegExp(".*celestial.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "angel-outfit";
				card.tags.push("celestial");
			} else if (RegExp(".*construct.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "robot-golem";
				card.tags.push("construct");
			} else if (RegExp(".*dragon.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "dragon-head";
				card.tags.push("dragon");
			} else if (RegExp(".*elemental.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "spark-spirit";
				card.tags.push("elemental");
			} else if (RegExp(".*fey.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "shambling-mound";
				card.tags.push("fey");
			} else if (RegExp(".*fiend.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "daemon-skull";
				card.tags.push("fiend");
			} else if (RegExp(".*giant.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "giant";
				card.tags.push("giant");
			} else if (RegExp(".*humanoid.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "strong";
				card.tags.push("humanoid");
			} else if (RegExp(".*monstrosity.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "gluttonous-smile";
				card.tags.push("monstrosity");
			} else if (RegExp(".*ooze.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "slime";
				card.tags.push("ooze");
			} else if (RegExp(".*plant.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "carnivorous-plant";
				card.tags.push("plant");
			} else if (RegExp(".*undead.*").test(monster.type._text.replace(/\([^\)]*\)/g, ''))) {
				card.icon = "shambling-zombie";
				card.tags.push("undead");
			} else {
				console.log(monster.type._text);
			}

			switch (monster.size._text) {
				case "T":
					card.contents.push("subtitle | Tiny " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("tiny");
					break;
				case "S":
					card.contents.push("subtitle | Small " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("small");
					break;
				case "M":
					card.contents.push("subtitle | Medium " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("medium");
					break;
				case "L":
					card.contents.push("subtitle | Large " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("large");
					break;
				case "H":
					card.contents.push("subtitle | Huge " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("huge");
					break;
				case "G":
					card.contents.push("subtitle | Gargantuan " + monster.type._text + ', ' + monster.alignment._text);
					card.tags.push("gargantuan");
					break;
			}
			card.contents.push("rule");
			card.contents.push("property | Armor Class | " + monster.ac._text);
			card.contents.push("property | Hit Points | " + monster.hp._text);
			card.contents.push("property | Speed | " + monster.speed._text);
			card.contents.push("rule");
			card.contents.push("dndstats | " + monster.str._text + " | " + monster.dex._text + " | " + monster.con._text + " | " + monster.int._text + " | " + monster.wis._text + " | " + monster.cha._text);
			card.contents.push("rule");
			monster.save.hasOwnProperty("_text") ? card.contents.push("property | Saving Throws | " + monster.save._text) : null;
			monster.skill.hasOwnProperty("_text") ? card.contents.push("property | Skills | " + monster.skill._text) : null;
			monster.resist.hasOwnProperty("_text") ? card.contents.push("property | Damage Resistances | " + monster.resist._text) : null;
			monster.vulnerable.hasOwnProperty("_text") ? card.contents.push("property | Damage Vulnerabilities | " + monster.vulnerable._text) : null;
			monster.immune.hasOwnProperty("_text") ? card.contents.push("property | Damage Immunities | " + monster.immune._text) : null;
			monster.conditionImmune.hasOwnProperty("_text") ? card.contents.push("property | Condition Immunities | " + monster.conditionImmune._text) : null;
			monster.senses.hasOwnProperty("_text") ? card.contents.push("property | Senses | " + monster.senses._text) : null;
			monster.passive.hasOwnProperty("_text") ? card.contents.push("property | Passive Perception | " + monster.passive._text) : null;
			monster.languages.hasOwnProperty("_text") ? card.contents.push("property | Languages | " + monster.languages._text) : null;
			monster.cr.hasOwnProperty("_text") ? card.contents.push("property | Challenge | " + monster.cr._text) : null;
			monster.cr.hasOwnProperty("_text") ? card.tags.push("CR " + monster.cr._text) : null;
			card.contents.push("rule");

			if (monster.hasOwnProperty("trait")) {

				if (monster.trait instanceof Array) {
					for (var j = 0; j < monster.trait.length; j++) {
						var trait = monster.trait[j];

						if (trait.text instanceof Array) {
							card.contents.push("property | " + trait.name._text + " | " + trait.text[0]._text);

							for (var t = 1; t < trait.text.length; t++) {
								trait.text[t].hasOwnProperty("_text") ? card.contents.push("text | " + trait.text[t]._text) : null;
							}
						} else {
							card.contents.push("property | " + trait.name._text + " | " + trait.text._text);
						}
					}
				} else {
					card.contents.push("property | " + monster.trait.name._text + " | " + monster.trait.text._text);
				}
			}

			if (monster.hasOwnProperty("action")) {
				card.contents.push("section | Actions");

				if (monster.action instanceof Array) {
					for (var x = 0; x < monster.action.length; x++) {
						var action = monster.action[x];

						if (action.text instanceof Array) {
							card.contents.push("property | " + action.name._text + " | " + action.text[0]._text);

							for (var a = 1; a < action.text.length; a++) {
								action.text[a].hasOwnProperty("_text") ? card.contents.push("text | " + action.text[a]._text) : null;
							}
						} else {
							card.contents.push("property | " + action.name._text + " | " + action.text._text);
						}
					}
				} else {
					card.contents.push("property | " + monster.action.name._text + " | " + monster.action.text._text)
				}
			}


			if (monster.hasOwnProperty("legendary")) {
				card.contents.push("section | " + monster.legendary[0].name._text);

				for (var y = 1; y < monster.legendary.length; y++) {
					var legendary = monster.legendary[y];

					if (legendary.text instanceof Array) {
						card.contents.push("property | " + legendary.name._text + " | " + legendary.text[0]._text);

						for (var z = 1; z < legendary.text.length; z++) {
							legendary.text[z].hasOwnProperty("_text") ? card.contents.push("text | " + legendary.text[z]._text) : null;
						}
					} else {
						card.contents.push("property | " + legendary.name._text + " | " + legendary.text._text);
					}
				}
			}

			card = getCardTooLong(card,'monster');

			result.push(card);
		}

		callback(null, result);
	})
}

function getItems(filename, callback) {
	convertXML(filename, function(e,data) {
		if (e) {
			callback(e);
		}

		var items = data.compendium.item;
		var result = [];

		var lookup = [];
		var lookupResult = {};

		for (var i = 0; i < items.length; i++) {
			var card = {
				"count": 1,
			    "color": "",
			    "title": "",
			    "icon": "",
			    "contents": [],
			    "tags": ["item"]
			}
			var item = items[i];

			// for (var key in item) {
			// 	if (key in lookupResult) {
			// 	} else {
			// 		lookup.push(key);
			// 		lookupResult[key] = 1;
			// 	}
			// }
		
			card.color = "gray";
			card.title = item.name._text;

			var type;

			switch (item.type._text) {
				case "$":
					card.icon = "cash"
					type = "Wealth"
					card.tags.push("wealth");
					break;
				case "A":
					card.icon = "arrow-cluster"
					type = "Ammunition"
					card.tags.push("ammunition");
					break;
				case "G":
					card.icon = "backpack"
					type = "Adventuring Gear"
					card.tags.push("adventuring gear");
					break;
				case "HA":
					card.icon = "breastplate"
					type = "Heavy Armor"
					card.tags.push("heavy armor");
					break;
				case "LA":
					card.icon = "leather-vest"
					type = "Light Armor"
					card.tags.push("light armor");
					break;
				case "M":
					card.icon = "crossed-swords"
					type = "Melee Weapon"
					card.tags.push("melee weapon");
					break;
				case "MA":
					card.icon = "mail-shirt"
					type = "Medium Armor"
					card.tags.push("medium armor");
					break;
				case "P":
					card.icon = "drink-me"
					type = "Potion"
					card.tags.push("potion");
					break;
				case "R":
					card.icon = "pocket-bow"
					type = "Ranged Weapon"
					card.tags.push("ranged weapon");
					break;
				case "RD":
					card.icon = "baton"
					type = "Rod"
					card.tags.push("rod");
					break;
				case "RG":
					card.icon = "ring"
					type = "Ring"
					card.tags.push("ring");
					break;
				case "S":
					card.icon = "shield"
					type = "Shield"
					card.tags.push("shield");
					break;
				case "SC":
					card.icon = "scroll-unfurled"
					type = "Scroll"
					card.tags.push("scroll");
					break;
				case "ST":
					card.icon = "wizard-staff"
					type = "Staff"
					card.tags.push("staff");
					break;
				case "W":
					card.icon = "explosion-rays"
					type = "Wondrous Item"
					card.tags.push("wondrous item");
					break;
				case "WD":
					card.icon = "orb-wand"
					type = "Wand"
					card.tags.push("wand");
					break;
			}

			subtitle = "subtitle | ";

			if (item.hasOwnProperty("magic") && item.magic._text == "1") {
				card.tags.push("magic");
				subtitle += "Magic ";
			}

			card.contents.push(subtitle + type);
			item.hasOwnProperty("detail") ? card.contents.push("subtitle | " + item.detail._text.replace(/requires\s/g, '')) : null;
			card.contents.push("rule");
			if (item.hasOwnProperty("ac")) {
				var ac = item.ac._text;

				if (item.type._text == 'LA') {
					ac += " + Dex Modifier";
				} else if (item.type._text == 'MA') {
					ac += " + Dex Modifier (max 2)"
				}

				card.contents.push("property | Armor Class | " + ac);
			}
			item.hasOwnProperty("strength") ? card.contents.push("property | Strength | " + item.strength._text) : null;
			item.weight.hasOwnProperty("_text") ? card.contents.push("property | Weight | " + item.weight._text) : null;
			item.hasOwnProperty("stealth") && item.stealth._text == "1" ? card.contents.push("property | Stealth | Disadvantage") : null;

			if (item.hasOwnProperty("dmgType") && item.hasOwnProperty("dmg1")) {
				var dmgType = ""

				switch (item.dmgType._text) {
					case "S":
						dmgType = "Slashing"
						break;
					case "P":
						dmgType = "Piercing"
						break;
					case "B":
						dmgType = "Bludgeoning"
						break;
				}

				card.contents.push("property | Damage | " + item.dmg1._text + " " + dmgType);
			}

			if (item.hasOwnProperty("range") && item.range.hasOwnProperty("_text")) {
				card.contents.push("property | Range | " + item.range._text);
			}

			if (item.hasOwnProperty("detail") && RegExp(".*attunement.*").test(item.detail._text)) {
				card.tags.push("attunement");
			}

			// if (item.hasOwnProperty("property")) {
			// 	if (item.property._text in lookupResult) {
			// 	} else {
			// 		lookup.push(item.property._text);
			// 		lookupResult[item.property._text] = 1;
			// 	}
			// }

			if (item.text instanceof Array) {
				for (var j = 0; j < item.text.length; j++) {
					if (i != 0 && /^\t/.test(item.text[j]._text) && /^\w+(?=:)/.test(item.text[j-1]._text)) {
						continue;
					} else if (/^\w+(?=:)/.test(item.text[j]._text) && /^\w+(?=:)/.exec(item.text[j]._text)[0] in ['Ammunition', 'Range', 'Curse', 'Thrown', 'Versatile', 'Heavy', 'Light', 'Two-Handed', 'Finesse', 'Reach', 'Loading']) {
						continue;
					}

					if (item.text[j].hasOwnProperty("_text") && !(/(^\w+:\s)(.+$)/.exec(item.text[j]._text))) {
						card.contents.push("text | " + item.text[j]._text);
					} else if (item.text[j].hasOwnProperty("_text")) {
						var condition = /^\w+(?=:)/.exec(item.text[j]._text)[0];
						var text = /(^\w+:\s)(.*$)/.exec(item.text[j]._text)[2];

						if (j+1 < item.text.length && /^\t/.test(item.text[j+1]._text)) {
							text += ' ' + /^\t(.*)/.exec(item.text[j+1]._text)[1];
						}
						card.contents.push("property | " + condition + " | " + text);
					}
				}
			} else {
				card.contents.push("text | " + item.text._text);
			}

			card = getCardTooLong(card,'item');

			result.push(card);
		}

		console.log(lookup);

		callback(null,result);
	})
}

function getCardTooLong(card, type) {
	var total = 0,
		lineLimit = 0,
		cardLimit = 0;

	if (type == 'item') {
		lineLimit = 46;
		cardLimit = 17;
	} else if (type == 'monster') {
		lineLimit = 147;
		cardLimit = 26;
	}
	
	for (var i = 0; i < card.contents.length; i++) {
		if (card.contents[i] != "rule") {
			total++;
		}

		var length = Math.floor(card.contents[i].length / lineLimit);
		total += length;
	}

	if (total >= cardLimit) {
		card.tags.push("long")
	}

	card.tags.push(total);
	return card
}

// getMonsters('CorePlusUnearthedArcana.xml', function(e,data) {
// 	if (e) {
// 		console.log(e.message);
// 	}

// 	var result = data;

// 	getMonsters('Book_of_Beautiful_Horrors.xml', function(e,data) {
// 		if (e) {
// 			console.log(e.message);
// 		}

// 		result.concat(data);

// 		fs.writeFile("./output/monsters.json", JSON.stringify(result, null, 4),function(e) {
// 			console.log("done");
// 		})
// 	})

// });

// getItems("CorePlusUnearthedArcana.xml", function(e,data) {
// 	if (e) {
// 		console.log(e.message);
// 	}

// 	var result = data;

// 	getItems("Book_of_Beautiful_Horrors.xml", function(e,data) {
// 		if (e) {
// 			console.log(e.message);
// 		}

// 		result.concat(data);

// 		fs.writeFile("./output/items.json", JSON.stringify(result, null, 4),function(e) {
// 			console.log("done");
// 		})
// 	})
// })