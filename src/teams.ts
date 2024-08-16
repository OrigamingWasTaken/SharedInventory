import {
	execute,
	MCFunction,
	raw,
	scoreboard,
	team,
	tellraw,
	_,
	Objective,
	tag,
	data,
	item,
	say,
} from 'sandstone';
import type { BASIC_COLORS } from 'sandstone/arguments/basics';

const TEAMS: { [key: string]: BASIC_COLORS } = {
	Black: 'black',
	'Dark blue': 'dark_blue',
	'Dark green': 'dark_green',
	'Dark aqua': 'dark_aqua',
	'Dark red': 'dark_red',
	'Dark purple': 'dark_purple',
	Gold: 'gold',
	Gray: 'gray',
	'Dark gray': 'dark_gray',
	Blue: 'blue',
	Green: 'green',
	Aqua: 'aqua',
	Red: 'red',
	'Light purple': 'light_purple',
	Yellow: 'yellow',
	White: 'white',
};

export function removeAllTeamTags() {
	for (const color of Object.values(TEAMS)) {
		tag('@s').remove(`si.team.${color}`);
	}
}

const SLOTS = [
	'container.0',
	'container.1',
	'container.2',
	'container.3',
	'container.4',
	'container.5',
	'container.6',
	'container.7',
	'container.8',
	'container.9',
	'container.10',
	'container.11',
	'container.12',
	'container.13',
	'container.14',
	'container.15',
	'container.16',
	'container.17',
	'container.18',
	'container.19',
	'container.20',
	'container.21',
	'container.22',
	'container.23',
	'container.24',
	'container.25',
	'container.26',
	'container.27',
	'container.28',
	'container.29',
	'container.30',
	'container.31',
	'container.32',
	'container.33',
	'container.34',
	'container.35',
	'container.36',
	'container.37',
	'container.38',
	'container.39',
	'container.40',
	'container.41',
	'container.42',
	'container.43',
	'container.44',
	'container.45',
	'container.46',
	'container.47',
	'container.48',
	'container.49',
	'container.50',
	'container.51',
	'container.52',
	'container.53',
	'armor.chest',
	'armor.feet',
	'armor.head',
	'armor.legs',
	'enderchest.0',
	'enderchest.1',
	'enderchest.2',
	'enderchest.3',
	'enderchest.4',
	'enderchest.5',
	'enderchest.6',
	'enderchest.7',
	'enderchest.8',
	'enderchest.9',
	'enderchest.10',
	'enderchest.11',
	'enderchest.12',
	'enderchest.13',
	'enderchest.14',
	'enderchest.15',
	'enderchest.16',
	'enderchest.17',
	'enderchest.18',
	'enderchest.19',
	'enderchest.20',
	'enderchest.21',
	'enderchest.22',
	'enderchest.23',
	'enderchest.24',
	'enderchest.25',
	'enderchest.26',
	'hotbar.0',
	'hotbar.1',
	'hotbar.2',
	'hotbar.3',
	'hotbar.4',
	'hotbar.5',
	'hotbar.6',
	'hotbar.7',
	'hotbar.8',
	'inventory.0',
	'inventory.1',
	'inventory.2',
	'inventory.3',
	'inventory.4',
	'inventory.5',
	'inventory.6',
	'inventory.7',
	'inventory.8',
	'inventory.9',
	'inventory.10',
	'inventory.11',
	'inventory.12',
	'inventory.13',
	'inventory.14',
	'inventory.15',
	'inventory.16',
	'inventory.17',
	'inventory.18',
	'inventory.19',
	'inventory.20',
	'inventory.21',
	'inventory.22',
	'inventory.23',
	'inventory.24',
	'inventory.25',
	'inventory.26',
	'weapon.offhand',
];

type TeamColor = (typeof TEAMS)[keyof typeof TEAMS];

function copyInventoryFromTeam(team: TeamColor) {
	const storage = `si:inventory_${team}`;
	for (const slot of SLOTS) {
		data.modify.block('0 300 0', 'container.0').set.from.storage(storage, slot);
		raw(`item replace entity @s ${slot} from block 0 300 0 container.0`);
	}
}

for (const [name, color] of Object.entries(TEAMS)) {
	const score = `join.${color}`;
	const storage = `si:inventory_${color}`;
	const temp_storage = `si:inventory_${color}_compare`;

	MCFunction(
		`teams/${color}/init`,
		() => {
			team.add(color);
			team.modify(color, 'color', color);
			// raw(`scoreboard objectives remove ${score}`);
			scoreboard.objectives.add(score, 'trigger');
			for (const slot of SLOTS) {
				raw(
					`execute unless data storage ${storage} ${slot} run data modify storage ${storage} ${slot} set value []`
				);
			}
		},
		{ runOnLoad: true }
	);

	MCFunction(`teams/${color}/sync`, () => {
		for (const slot of SLOTS) {
			data.modify.block('0 300 0', 'Items').set.from.storage(storage, slot);
			data.modify.storage(temp_storage, 'default').set.from.block('0 300 0', 'Items');
			raw(`item replace block 0 300 0 container.0 from entity @s ${slot}`);
			execute.store.success
				.score('default', 'si.temp')
				.run.data.modify.storage(storage, slot)
				.set.from.block('0 300 0', 'Items');
			execute.if.score('default', 'si.temp', 'matches', 1).run(() => {
				data.modify.storage(storage, slot).set.from.block('0 300 0', 'Items');
				raw(`item replace entity @a[tag=si.team.${color}] ${slot} from entity @s ${slot}`);
			});
		}
	});

	MCFunction(
		`teams/${color}/tick`,
		() => {
			// Score and join teams
			scoreboard.players.enable('@a', score);
			execute.as(`@a[scores={${score}=1..}]`).run(() => {
				execute.if.score('.main', 'si.running', 'matches', 0).run(() => {
					team.join(color, '@s');
					removeAllTeamTags();
					tag('@s').add(`si.team.${color}`);
					copyInventoryFromTeam(color);
					tellraw('@s', {
						text: `Vous êtes maintenant dans la team '${name}'.`,
						color: `${color}`,
					});
				});
				execute.unless.score('.main', 'si.running', 'matches', 0).run(() => {
					tellraw('@s', {
						text: 'Vous ne pouvez pas rejoindre de team quand une partie est active.',
						color: 'red',
					});
				});
				scoreboard.players.reset('@s', score);
			});

			// Copy inventory
			execute.if
				.score('.main', 'si.running', 'matches', 1)
				.as(`@a[tag=si.team.${color}]`)
				.at('@s')
				.run.functionCmd(`si:teams/${color}/sync`);
			raw('item replace block 0 300 0 container.0 with air');
		},
		{ runEveryTick: true }
	);
}
