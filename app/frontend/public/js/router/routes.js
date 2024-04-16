export default {
	'/': {
		page: 'html_pages/placeholder.html'
	},
	'#/pong/local': {
		page: 'html_pages/match/pong_local.html',
		script: 'js/match/pong_local.js',
		auth: true
	},
	'#/pong/remote': {
		page: 'html_pages/match/pong_remote.html',
		script: 'js/match/pong_remote.js',
		auth: true
	},
	'#/pong/ai': {
		page: 'html_pages/match/pong_ai.html',
		script: 'js/match/pong_ai.js',
		auth: true
	},
	'#/login': {
		page: 'html_pages/login.html',
		script: 'js/login.js',
	},
	'#/otp': {
		page: 'html_pages/otp.html',
		script: 'js/otp.js',
	},
	'#/register': {
		page: 'html_pages/register.html',
		script: 'js/register.js',
	},
	'#/successful_registration': {
		page: 'html_pages/successful_registration.html',
		script: 'js/successful_registration.js',
	},
	'#/players/detail/:id': {
		page: 'html_pages/players.html',
		script: 'js/players.js',
		auth: true
	},
	'#/players/list': {
		page: 'html_pages/list.html',
		script: 'js/list.js',
		auth: true
	},
	'#/players/search': {
		page: 'html_pages/search.html',
		script: 'js/search.js',
		auth: true
	},
	'#/players/friends': {
		page: 'html_pages/friends.html',
		script: 'js/friends.js',
		auth: true
	},
	'#/players/friend_requests': {
		page: 'html_pages/pending_requests.html',
		script: 'js/pending_requests.js',
		auth: true
	},
	'#/profile/detail': {
		page: 'html_pages/detail.html',
		script: 'js/detail.js',
		auth: true
	},
	'#/profile/edit': {
		page: 'html_pages/edit.html',
		script: 'js/edit.js',
		auth: true,
	},
	'#/tournament/create': {
		page: 'html_pages/tournament/create.html',
		script: 'js/tournament/create.js',
		auth: true
	},
	'#/tournament/search': {
		page: 'html_pages/tournament/search.html',
		script: 'js/tournament/search.js',
		auth: true
	},
	'#/tournament/start/:id': {
		page: 'html_pages/tournament/start.html',
		script: 'js/tournament/start.js',
		auth: true
	},
	'#/tournament/join/:id': {
		page: 'html_pages/tournament/join.html',
		script: 'js/tournament/join.js',
		auth: true
	},
	'#/tournament/detail/:id': {
		page: 'html_pages/tournament/detail.html',
		script: 'js/tournament/detail.js',
		auth: true
	},
}