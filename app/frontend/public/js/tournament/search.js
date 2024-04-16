import PlayersService from "../players.service.js";
import TournamentService from "./service.js";

async function searchTounaments() {
	const logged = await PlayersService.getList();
	if (!logged.ok) {
		window.location.href = '#/login';
		return;
	}

	const response = await TournamentService.getList();
	const list = await response.json();

	const container = document.getElementById('list_tournament');

	// Create a table
	const table = document.createElement('table');
	table.className = 'table table-striped table-bordered table-hover';
	container.appendChild(table);

	// Create the table header
	const thead = document.createElement('thead');
	table.appendChild(thead);
	const tr = document.createElement('tr');
	thead.appendChild(tr);
	const headers = ['Tournament Name', 'Status', 'Actions'];
	headers.forEach(header => {
		const th = document.createElement('th');
		tr.appendChild(th);
		th.textContent = header;
		if (header === 'Actions') {
			th.className = 'text-end';
		}
	});

	// Create the table body
	const tbody = document.createElement('tbody');
	table.appendChild(tbody);

	if (list.length === 0) {
		const tr = document.createElement('tr');
		tbody.appendChild(tr);
		const td = document.createElement('td');
		td.setAttribute('colspan', '4');
		td.textContent = 'No tournament found';
		tr.appendChild(td);
	}

	list.forEach(tournament => {
		const tr = document.createElement('tr');
		// Align the items vertically
		tr.className = 'align-middle';
		tbody.appendChild(tr);

		// Tournament Name
		const tdTournament = document.createElement('td');
		tr.appendChild(tdTournament);
		tdTournament.textContent = tournament.name.substring(0, 20);
		
		// Tournament Status
		const tdStatus = document.createElement('td');
		tr.appendChild(tdStatus);
		tdStatus.textContent = tournament.status;
		
		// Tournament actions

		const tdActions = document.createElement('td');
		tdActions.className = 'text-end';
		tr.appendChild(tdActions);

		if (tournament.status != 'Not Started')
		{
			const aDetail = document.createElement('a');
			aDetail.href = '#/tournament/detail/' + tournament.id;
			aDetail.className = 'btn btn-primary';
			aDetail.textContent = 'Detail';
			tdActions.appendChild(aDetail);
		}
		else
		{
			const aDetail = document.createElement('a');
			aDetail.href = '#/tournament/start/' + tournament.id;
			aDetail.className = 'btn btn-success';
			aDetail.textContent = 'START';
			tdActions.appendChild(aDetail);
		}
	});
}

searchTounaments();