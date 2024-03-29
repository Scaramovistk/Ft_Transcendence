import AccountsService from "./accounts.service.js";

async function init() {
  const response = await AccountsService.getDetail();
  if (!response.ok) {
    window.location.href = '#/login';
    return;
  }
  const user = await response.json();

  const avatar = document.getElementById('profile_avatar');
  const username = document.getElementById('profile_username');
  const bio = document.getElementById('profile_bio');

  avatar.src = user.avatar || 'https://www.gravatar.com/avatar/';
  username.innerHTML = user.username;
  bio.innerHTML = user.bio;
}

init();

//still needs to insert match history in html and an option to see friends (maybe different page for friends?)