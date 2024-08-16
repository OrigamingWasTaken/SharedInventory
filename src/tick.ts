import { execute, MCFunction, scoreboard, team, tellraw } from 'sandstone';
import { removeAllTeamTags } from './teams.ts';

MCFunction('tick', () => {
	scoreboard.players.enable('@a', 'leave_team');
	execute.as('@a[scores={leave_team=1..}]').run(() => {
		team.leave('@s');
		removeAllTeamTags();
		tellraw('@s', { text: 'Vous avez quitté votre équipe.', color: 'red' });
		scoreboard.players.reset('@s', 'leave_team');
	});
});
