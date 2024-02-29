import Authenticate from './authenticate.js'

function lol() {
	const form = document.getElementById('loginform');
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		const errormsg = document.getElementById('invalid-form');
		const formdata = new FormData(form);
		const jsondata = Object.fromEntries(formdata.entries());
		const user = {
			username: jsondata.username,
			password: jsondata.password,
		};

		const response = await Authenticate.login(user);
		if (response.ok) { //https://developer.mozilla.org/en-US/docs/Web/API/Response
			const django_response = await response.json();
			localStorage.setItem('id', django_response.user);
			localStorage.setItem('qr_code', django_response.qr_code);
			window.location.href = '#/otp';
		} else  { //https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized
			errormsg.innerText = "Invalid username or password";
		}
	});
}

lol();