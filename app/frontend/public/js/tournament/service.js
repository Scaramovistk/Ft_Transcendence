const TOURNAMENT_API = "https://127.0.0.1:5000" + '/tournaments/';

export default class TournamentService {

	static async getList() {
		return await fetch(TOURNAMENT_API + 'list', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async getDetail(id) {
		return await fetch(TOURNAMENT_API + 'detail/' + id, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async search(name) { //Is this one going to be nescessarie
		return await fetch(TOURNAMENT_API + 'search/' + name, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async getMatchList() {
		return await fetch(PLAYERS_API + 'match/list', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	  }
}