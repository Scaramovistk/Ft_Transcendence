import AccountsService from "./accounts.service.js";

function setMatchStat(statId, statText) {
  const cell = document.getElementById(statId);
  cell.textContent = statText;
}

function setMatchStatsandHistory(list) {

  if (Object.entries(list).length === 0 || list.total === 0) {
    return ;
  }

  setMatchStat("total", list.total);
  setMatchStat("wins", list.wins);
  setMatchStat("losses", list.losses);

  const tbody = document.createElement('tbody');
  document.getElementById('match_history_table').appendChild(tbody);

  list.matches.reverse().forEach(match => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    // Date
    const tdDate = document.createElement('td');
    tr.appendChild(tdDate);
    tdDate.textContent = match.date;
    // Opponent
    const tdOpponent = document.createElement('td');
    if (match.opponent !== "None") {
      const link = document.createElement('a');
      link.href = '#/players/detail/' + match.opponent_id;
      link.textContent = match.opponent;
      tdOpponent.appendChild(link);
    } else {
      tdOpponent.textContent = "[anonymized]";
    }
    tr.appendChild(tdOpponent);
    // Result
    const tdResult = document.createElement('td');
    tr.appendChild(tdResult);
    tdResult.textContent = match.end_score;
  })
  document.getElementById('match_stats').style.display = 'block';
  document.getElementById('match_history').style.display = 'block';
}

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

  setMatchStatsandHistory(user.match_history);
}

init();

export { setMatchStatsandHistory }

//still needs to insert match history in html and an option to see friends (maybe different page for friends?)