import Authenticate from './authenticate.js'

function lol() {
	const form = document.getElementById('verifyform');
	const qr = document.getElementById('qr_code');
	qr.src = localStorage.getItem('qr_code');
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		const errormsg = document.getElementById('invalid-form');
		const formdata = new FormData(form);
		const jsondata = Object.fromEntries(formdata.entries());
		const user = {
			id: localStorage.getItem('id'),
			otp: jsondata.otp,
		};

		const response = await Authenticate.verify(user);
		if (response.ok) { //https://developer.mozilla.org/en-US/docs/Web/API/Response
			const django_response = await response.json();
			localStorage.removeItem('qr_code');
			localStorage.removeItem('id');
			localStorage.setItem('access_token', django_response.access);
      		localStorage.setItem('refresh_token', django_response.refresh);
			  window.location.href = '#/profile/detail';
		} else  { //https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized
			errormsg.innerText = "Invalid otp";
		}
	});
}

lol();