import Authenticate from "./authenticate.js";

function lol() {
	const form = document.getElementById('registerform');
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		const errormsg = document.getElementById('invalid-form');
		const formdata = new FormData(form);
		const jsondata = Object.fromEntries(formdata.entries());
		const user = {
			username: jsondata.username,
			email: jsondata.email_address,
			password: jsondata.password,
		};
		if(user.password !== jsondata.confirm_password) {
			errormsg.innerText = "Passwords do not match";
			return ;
		}
		const response = await Authenticate.register(user);
		if (response.ok) { //https://developer.mozilla.org/en-US/docs/Web/API/Response
			const django_response = await response.json();
			console.log(django_response.qr_code);
			localStorage.setItem('qr_code', django_response.qr_code);
			window.location.href = '#/successful_registration';
			return ;
		} else {
			const data = await response.json();
      		if (data.username) {
        		errormsg.innerText = 'username: ' + data.username;
      		}
			  if (data.email) {
        		errormsg.innerText = 'email: ' + data.email;
      		}
      		if (data.password) {
      			errormsg.innerText = 'password: ' + data.password;
      		}
		}
	});

}

lol();