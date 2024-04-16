import PlayersService from './players.service.js'

async function friends() {

	const response = await PlayersService.getFriendsList();
  
	if (!response.ok) {
		window.location.href = '#/login';
		return;
	}
	const list = await response.json();
	const container = document.getElementById('search_container');

	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
  
	// Create a table
	const table = document.createElement('table');
	table.className = 'table table-striped table-bordered table-hover';
	container.appendChild(table);
  
	// Create the table header
	const thead = document.createElement('thead');
	table.appendChild(thead);
	const tr = document.createElement('tr');
	thead.appendChild(tr);
	const headers = ['Avatar', 'Username', 'Online status', 'Actions'];
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
	  td.setAttribute('colspan', headers.length.toString());
	  td.textContent = 'No friends found';
	  tr.appendChild(td);
	}

	list.forEach(player => {
		const tr = document.createElement('tr');
		// Align the items vertically
		tr.className = 'align-middle';
		tbody.appendChild(tr);
	
		// Player avatar
		const tdAvatar = document.createElement('td');
		tr.appendChild(tdAvatar);
		const img = document.createElement('img');
		tdAvatar.appendChild(img);
		img.src = player.avatar || 'https://www.gravatar.com/avatar/';
		img.alt = player.username;
		img.className = 'rounded-circle';
		img.width = 50;
		img.height = 50;
	
		// Player username
		const tdUsername = document.createElement('td');
		tr.appendChild(tdUsername);
		tdUsername.textContent = player.username;
	
		// Player points
		const tdPoints = document.createElement('td');
		tr.appendChild(tdPoints);
		if (player.login_otp_used) {
			tdPoints.textContent = 'online';
		} else {
			tdPoints.textContent = 'offline';
		} 
	
		// Player actions
		const tdActions = document.createElement('td');
		tdActions.className = 'text-end';
		tr.appendChild(tdActions);
	
		// Detail button
		const aDetail = document.createElement('a');
		aDetail.href = '#/players/detail/' + player.id;
		aDetail.className = 'btn btn-primary';
		aDetail.textContent = 'Detail';
		tdActions.appendChild(aDetail);
	  });
  }
  
  async function init() {
	await friends();
  }
  
  init();