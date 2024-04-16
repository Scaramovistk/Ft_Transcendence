import config from '../../config.js'

const TOURNAMENT_API = config.BACKEND_URL + '/tournaments/';

export default class TournamentService {

	static async tournament(tournament) {
		return await fetch(TOURNAMENT_API + "create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tournament),
		});
	}

	static async getList() {
		return await fetch(TOURNAMENT_API + 'list', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async updateTournamet(data) {
		const formData = new FormData();
	
		for (const key in data) {
			formData.append(key, data[key]);
		}
	
		return await fetch(TOURNAMENT_API + 'update', {
			method: 'PUT',
			headers: {
			'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
			body: formData,
		});
	}

	static async startTournament(id_tournament) {
		return await fetch(TOURNAMENT_API + 'start/' + id_tournament, {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async incompleteTournament(id_tournament) {
		return await fetch(TOURNAMENT_API + 'incomplete/' + id_tournament, {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
		});
	}

	static async finishTournament(id_tournament, winner_name) {
		return await fetch(TOURNAMENT_API + 'finish/' + id_tournament + '/' + winner_name, {
			method: 'PUT',
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

	static async getMatchList(id) {
		return await fetch(TOURNAMENT_API + 'match_history/' + id, {
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
}