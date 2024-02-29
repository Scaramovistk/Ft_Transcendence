import PlayersService from "../players.service.js";
import TournamentService from "./service.js";
import { getRouteParams } from '../router/routeParams.js';

async function searchMatches() {
	const logged = await PlayersService.getList();
	if (!logged.ok) {
		window.location.href = '#/login';
		return;
	}

	const id = getRouteParams().id;
	const response = await TournamentService.getDetail(id);
	const tournament = await response.json();

	// const list = await response.json(); // This need to be the objects that are inside the tournament, so i need to write a getter for it

	const container = document.getElementById('players');

	const tournament_name = document.getElementById('tournament_name');
	tournament_name.innerHTML = tournament.name;

	// Create a table

	// TODO add the amount of players in the side of the table

	const table = document.createElement('table');
	table.className = 'table table-striped table-bordered table-hover';
	container.appendChild(table);

	// Create the table header
	const thead = document.createElement('thead');
	table.appendChild(thead);
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

	// Create the table body
	const tbody = document.createElement('tbody');
	table.appendChild(tbody);

	if (tournament.player_in.length === 0) {
		const tr = document.createElement('tr');
		tbody.appendChild(tr);
		const td = document.createElement('td');
		td.setAttribute('colspan', '3');
		td.textContent = 'No players in Tournament';
		tr.appendChild(td);
	}

	// Is it needed to create a player class for the tournament
	tournament.player_in.forEach(player => {
		const tr = document.createElement('tr');
	
		tr.className = 'align-middle';
		tbody.appendChild(tr);
	
		const tdPlayer = document.createElement('td');
		tr.appendChild(tdPlayer);
		tdPlayer.textContent = player.substring(0, 20);
	
		const tdPlayers = document.createElement('td');
		tr.appendChild(tdPlayers);
		tdPlayers.textContent = tournament.player_qty; //Points in the tournament
	
		const tdStatus = document.createElement('td');
		tr.appendChild(tdStatus);
		tdStatus.textContent = tournament.status; //Change for the player Status
	});

	// To do the matches

	// tournament.player_in.forEach(match => { //Change player_in for the matchs
	// 	const tr = document.createElement('tr');

	// 	tr.className = 'align-middle';
	// 	tbody.appendChild(tr);

	// 	const tdMatch = document.createElement('td');
	// 	tr.appendChild(tdMatch);
	// 	tdMatch.textContent = match.substring(0, 20);

	// 	const tdPlayers = document.createElement('td');
	// 	tr.appendChild(tdPlayers);
	// 	tdPlayers.textContent = match.player_qty + ' / ' + match.player_max;

	// 	const tdStatus = document.createElement('td');
	// 	tr.appendChild(tdStatus);
	// 	tdStatus.textContent = match.status;

	// 	const tdActions = document.createElement('td');
	// 	tdActions.className = 'text-end';
	// 	tr.appendChild(tdActions);

	// 	const aDetail = document.createElement('a');
	// 	if (match.player_max == match.player_qty || match.status != 'not_started') {
	// 		aDetail.href = '#/tournaments/detail/' + match.id;
	// 		aDetail.className = 'btn btn-primary';
	// 		aDetail.textContent = 'Detail';
	// 	} else {
	// 		aDetail.href = '#/tournament/join/' + match.id;
	// 		aDetail.className = 'btn btn-success';
	// 		aDetail.textContent = 'JOIN';
	// 	}
	// 	tdActions.appendChild(aDetail);
	// });
}

searchMatches();