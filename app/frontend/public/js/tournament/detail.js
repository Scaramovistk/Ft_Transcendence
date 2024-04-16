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

	const response_list = await TournamentService.getMatchList(id);
	const matches = await response_list.json();

	const tournament_name = document.getElementById('tournament_name');
	tournament_name.innerHTML = tournament.name;
	
	const winner_name = document.getElementById('winner_name');
	winner_name.innerHTML = tournament.winner;

	const containerMatchs = document.getElementById('matchs');

	const tableMt = document.createElement('table');
	tableMt.className = 'table table-striped table-bordered table-hover';
	containerMatchs.appendChild(tableMt);

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

	const tbodyMt = document.createElement('tbody');
	tableMt.appendChild(tbodyMt);

	if (tournament.status === "Incomplete") {
		const tr = document.createElement('tr');
		tbodyMt.appendChild(tr);
		const td = document.createElement('td');
		td.setAttribute('colspan', '3');
		td.textContent = 'Torunament was incomplet';
		tr.appendChild(td);
	}

	matches.matches.forEach(match => {
		const tr = document.createElement('tr');
		tr.className = 'align-middle';
		tbodyMt.appendChild(tr);
	
		const tdPlayer1 = document.createElement('td');
		tr.appendChild(tdPlayer1);
		tdPlayer1.textContent = match.left_player;
	
		const tdPlayer2 = document.createElement('td');
		tr.appendChild(tdPlayer2);
		tdPlayer2.textContent = match.right_player;
	
		const tdResult = document.createElement('td');
		tr.appendChild(tdResult);
		tdResult.textContent = match.end_score;
	});
}

searchMatches();