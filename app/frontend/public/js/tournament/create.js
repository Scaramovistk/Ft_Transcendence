import Authenticate from "../authenticate.js";
// import PlayersService from "../players.service.js";

function createTournament() {
	// const auth = await PlayersService.getList();
	// if (!auth.ok) {
	// 	window.location.href = '#/login';
	// 	return;
	// }
	const form = document.getElementById('tournament_form');
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		const players = ['Davos', 'Tornado', 'Herman'];

		const errormsg = document.getElementById('invalid-form');
		const formData = new FormData(form);
		const tournament = {
			name: formData.get('tournament_name'),
			player_in: players,
			player_max: formData.get('amount_of_players'),
			life: formData.get('players_life'),
			matches: null
		};

		const response = await Authenticate.tournament(tournament);

		if (response.ok) { // Automaticly add the creator to the tournament, and popup success
			window.location.href = '#/tournament/success';
		} else {
			errormsg.innerText = "Creation of Tournament failed. Please try again.";
		}
	});
}

createTournament();