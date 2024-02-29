import routes from './routes.js'
import { setRouteParams } from './routeParams.js';
import { isAuthenticated, logout } from "../auth.js";

async function getPage() {
	const request = window.location.hash || '/';

	if (request === '#/logout') {
		logout();
		return;
	}

	let route = routes[request];

	if (route === undefined) {
		const routeParts = request.split('/');
	
		// Get base route removing last part, join with /m add :id at the end
		const baseRoute = routeParts.slice(0, -1).join('/') + '/:id';
	
		// Check if the base route exists
		if (routes[baseRoute]) {
			route = routes[baseRoute];
			setRouteParams({ id: routeParts[routeParts.length - 1] });
		}
	}

	if (route) {
		if (route.auth && await isAuthenticated() === false) {
			window.location.hash = '#/login';
			return;
		}
		fetch(route.page).then(response => response.text()).then(html => {
			document.getElementById('app').innerHTML = html;
			if (route.script) {
				const oldscript = document.querySelector('script[data-script="route-script"]');
				if (oldscript) {
					// document.head.removeChild(oldscript);
					oldscript.remove();
				}
				const script = document.createElement('script');
				script.type = 'module';
				script.dataset.script = 'route-script';
				script.src = `${route.script}?ts=${new Date().getTime()}`;
				document.head.appendChild(script);
			}
		});
	} else {
		document.getElementById('app').innerHTML = "Page not found";
	}

	const logger = document.getElementById('logger');
  	if (await isAuthenticated()) {
    	logger.innerHTML = 'Logout';
    	logger.href = '#/logout';
  	} else {
    	logger.innerHTML = 'Login';
    	logger.href = '#/login';
  	}

}

function setupRouter() {
	window.addEventListener('hashchange', getPage);

	document.body.addEventListener('click', e => {
		if (e.target.matches('[data-link]')) {
			e.preventDefault();
			window.location.hash = e.target.getAttribute('href').substring(1);
		}
	});

	getPage();
}

export { setupRouter };