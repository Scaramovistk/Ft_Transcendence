import PlayersService from "./players.service.js";
import { getRouteParams } from './router/routeParams.js';

async function init() {
	const id = getRouteParams().id;
	const response = await PlayersService.getDetail(id);
	if (!response.ok) {
	  window.location.href = '#/login';
	  return;
	}
	const player = await response.json();
  
	const avatar = document.getElementById('player_avatar');
	const username = document.getElementById('player_username');
	const bio = document.getElementById('player_bio');
  
	avatar.src = player.avatar || 'https://www.gravatar.com/avatar/';
	username.innerHTML = player.username;
	bio.innerHTML = player.bio;
  }
  
  init();

//still needs to insert match history in html and an option to see friends (maybe different page for friends?) 
// here maybe a button to send a friend request and you can accept requests on a different page?