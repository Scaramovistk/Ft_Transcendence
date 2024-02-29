import config from '../config.js'

const AUTH_PATH = config.BACKEND_URL + "/auth/" //ENV_FILE?

export default class Authenticate { //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

	static async login(user) {
		return await fetch(AUTH_PATH + "login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
	}

	static async verify(user) {
		return await fetch(AUTH_PATH + "otp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
	}

	static async register(user) {
		return await fetch(AUTH_PATH + "register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
	}

	static async verifyToken(token) {
		return await fetch(AUTH_PATH + 'token/verify', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ token }),
		});
	  }
	
	  static async refreshToken(refresh) {
		return await fetch(AUTH_PATH + 'token/refresh', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ refresh }),
		});
	  }
}