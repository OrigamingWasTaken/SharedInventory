import { MCFunction, scoreboard, tellraw, setblock, forceload, execute, tell } from 'sandstone';

MCFunction(
	'load',
	() => {
		scoreboard.objectives.add('si.running', 'dummy');
        execute.unless
			.score('.main', 'si.running', 'matches', '0..')
			.run.scoreboard.players.set('.main', 'si.running', 0);
		scoreboard.objectives.add('leave_team', 'trigger');
		scoreboard.objectives.add('si.temp', 'dummy');
		forceload.add('0 0');
		setblock('0 300 0', 'chest', 'keep');
		tellraw('@a', [
			'\n========= Congratulations! =========\n\n',
			{ text: ' SharedInventory', color: 'gold', bold: true },
			' is ',
			{ text: 'successfully installed.\n\n', color: 'green' },
			' by OrigamingWasTaken on GitHub!\n',
			'==============',
			{ text: '🏹', color: '#D2691E' },
			{ text: '⚔', color: '#45ACA5' },
			{ text: '⛏', color: '#FFD700' },
			'==============',
		]);
	},
	{ runOnLoad: true }
);

MCFunction('start', () => {
	execute.if.score('.main', 'si.running', 'matches', 1).run(() => {
		tellraw('@s', { text: 'Une partie est déjà en cours.', color: 'red' });
	});
	execute.if.score('.main', 'si.running', 'matches', 0).run(() => {
		scoreboard.players.set('.main', 'si.running', 1);
		tellraw('@a', { text: 'La partie commence!', color: 'green' });
	});
});

MCFunction('stop', () => {
	execute.if.score('.main', 'si.running', 'matches', 0).run(() => {
		tellraw('@s', { text: "Aucune partie n'est actuellement en cours.", color: 'red' });
	});
	execute.if.score('.main', 'si.running', 'matches', 1).run(() => {
		scoreboard.players.set('.main', 'si.running', 0);
		tellraw('@a', { text: 'La partie a été stop.', color: 'green' });
	});
});
