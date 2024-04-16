import Authenticate from "./service.js";
import AuthService from "../accounts.service.js";

// import PlayersService from "../players.service.js";

async function createTournament() {
	const response = await AuthService.getDetail();
	if (!response.ok) {
		window.location.href = '#/login';
		return;
	}

	const user = await response.json();

	const form = document.getElementById('tournament_form');
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		const errormsg = document.getElementById('invalid-form');
		const formData = new FormData(form);
		const tournament = {
			name: formData.get('tournament_name'),
			player_max: formData.get('amount_of_players'),
			winner: 'None',
			life: formData.get('players_life'),
		};

		const response = await Authenticate.tournament(tournament);

		// Take the id of the tournament here and send to the start

		console.log(response);
		if (response.ok) {
			window.location.href = '#/tournament/search' ;
		} else {
			errormsg.innerText = "Creation of Tournament failed. Please try again.";
		}
	});
}

createTournament();