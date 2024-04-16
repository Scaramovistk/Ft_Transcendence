import PlayersService from "../players.service.js";
import AuthService from "../accounts.service.js";
import TournamentService from "./service.js";
import { getRouteParams } from '../router/routeParams.js';

async function searchMatches() {
	const logged = await PlayersService.getList(); //Here aldeady ask to join it
	if (!logged.ok) {
		window.location.href = '#/login';
		return;
	}

	const tournament_id = getRouteParams().id;
	const response = await TournamentService.getDetail(tournament_id);
	const tournament = await response.json();

	const user_response = await AuthService.getDetail();

	const user = await user_response.json();

	TournamentService.join(tournament_id, user.id);
	console.log(user.id + "Here is the error");

	// const list = await response.json(); // This need to be the objects that are inside the tournament, so i need to write a getter for it

	const tournament_name = document.getElementById('tournament_name');
	tournament_name.innerHTML = tournament.name;
	
	const containerPlayer = document.getElementById('players');
	const containerMatchs = document.getElementById('matchs');

	// Create a table

	// ADD autmatically start tournament when its full
	// And add redirection for the details page

	const tablePl = document.createElement('table');
	tablePl.className = 'table table-striped table-bordered table-hover';
	containerPlayer.appendChild(tablePl);

	const tableMt = document.createElement('table');
	tableMt.className = 'table table-striped table-bordered table-hover';
	containerMatchs.appendChild(tableMt);

	// Create the table header
	const thead = document.createElement('thead');
	tablePl.appendChild(thead);
	const tr = document.createElement('tr');
	thead.appendChild(tr);
	const headers = ['Player', 'Points', 'Status'];
	headers.forEach(header => {
		const th = document.createElement('th');
		tr.appendChild(th);
		th.textContent = header;
		if (header === 'Status') {
			th.className = 'text-end';
		}
	});
	
	const theadMt = document.createElement('thead');
	tableMt.appendChild(theadMt);
	const trMt = document.createElement('tr');
	theadMt.appendChild(trMt);
	const headersMt = ['Player 1', 'Players 2', 'Result'];
	headersMt.forEach(headerMt => {
		const thMt = document.createElement('th');
		trMt.appendChild(thMt);
		thMt.textContent = headerMt;
		if (headerMt === 'Status') {
			thMt.className = 'text-end';
		}
	});

	const tbody = document.createElement('tbody');
	tablePl.appendChild(tbody);

	const tbodyMt = document.createElement('tbody');
	tableMt.appendChild(tbodyMt);

	if (tournament.player_in.length === 0) {
		const tr = document.createElement('tr');
		tbody.appendChild(tr);
		const td = document.createElement('td');
		td.setAttribute('colspan', '3');
		td.textContent = 'No players in Tournament';
		tr.appendChild(td);
	}

	if (tournament.player_in.length === 0) { //Change this for the matchs
		const tr = document.createElement('tr');
		tbodyMt.appendChild(tr);
		const td = document.createElement('td');
		td.setAttribute('colspan', '3');
		td.textContent = 'No Matches yet';
		tr.appendChild(td);
	}

	tournament.player_in.forEach(async (id) => {
		const tr = document.createElement('tr');
		const resp = await PlayersService.getDetail(id);
		const player = await resp.json();
	
		// console.log(resp);
		tr.className = 'align-middle';
		tbody.appendChild(tr);
	
		const tdPlayer = document.createElement('td');
		tr.appendChild(tdPlayer);
		tdPlayer.textContent = player.username;
	
		const tdPlayers = document.createElement('td');
		tr.appendChild(tdPlayers);
		tdPlayers.textContent = tournament.player_qty; // Points in the tournament
	
		const tdStatus = document.createElement('td');
		tr.appendChild(tdStatus);
		tdStatus.textContent = tournament.status; // Change for the player Status
	});

	tournament.player_in.forEach(match => { //Change player_in for the matchs
		const tr = document.createElement('tr');

		tr.className = 'align-middle';
		tbodyMt.appendChild(tr);

		const tdPlayer1 = document.createElement('td');
		tr.appendChild(tdPlayer1);
		tdPlayer1.textContent = match;
		
		const tdPlayer2 = document.createElement('td');
		tr.appendChild(tdPlayer2);
		tdPlayer2.textContent = match;

		const tdStatus = document.createElement('td');
		tr.appendChild(tdStatus);
		tdStatus.textContent = match.status;
	});
}

searchMatches();