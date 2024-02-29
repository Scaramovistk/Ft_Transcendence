function init() {
	let qr = document.getElementById('qr_code');
	qr.src = localStorage.getItem('qr_code');
}

init();