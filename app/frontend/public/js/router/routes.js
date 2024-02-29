export default {
	'/': {
		page: 'html_pages/placeholder.html'
	},
	'#/pong_test_index': {
		page: 'html_pages/pong_test_index.html',
		script: 'js/pong/pong.js',
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
	'#/chat': {
		page: 'html_pages/chat/chat.html',
		script: 'js/chat/chat.js',
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
	'#/tournament/success': {
		page: 'html_pages/tournament/success.html',
		auth: true
	},
	'#/tournament/join/:id': {
		page: 'html_pages/tournament/join.html',
		script: 'js/tournament/join.js',
		auth: true
	},
}