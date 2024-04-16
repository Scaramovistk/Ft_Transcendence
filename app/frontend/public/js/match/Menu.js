import { joinMatchHandler, stopWaitingHandler, handleLogout, closeModalHandler, pongGame } from './internal.js'

export class Menu {

    constructor(type, text = null) {

        this.modal = new bootstrap.Modal(document.getElementById('menu'));
        this.title = document.getElementById("menu-title");
        this.body = document.getElementById("menu-body");
        this.footer = document.getElementById("menu-footer");
        this.header = document.getElementById("menu-header");
        this.buttonMap = new Map();
        this.title.textContent = "";
        this.body.innerHTML = "";
        this.footer.innerHTML = "";
        this.text = text;
        
        if (type === 'start') {
            this.title.textContent = "Let's Pong!";
            this.addRules();
            this.addButton(this.footer, 'Play', 'btn', 'btn-success', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Play').addEventListener('click', joinMatchHandler);
            this.addButton(this.footer, 'Close', 'btn', 'btn-secondary', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Close').addEventListener('click', closeModalHandler);
        } else if (type === 'wait') {
            this.title.textContent = "Searching opponent";
            this.addSpinner();
            this.addButton(this.footer, 'Quit', 'btn', 'btn-warning', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Quit').addEventListener('click', stopWaitingHandler);
        } else if (type === 'end') {
            this.title.textContent = "We have a winner!";
            this.body.textContent = this.getTextForEndMenu();
            this.addButton(this.footer, 'Close', 'btn', 'btn-secondary', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Close').addEventListener('click', closeModalHandler);
            this.addButton(this.footer, 'Play again', 'btn', 'btn-success', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Play again').addEventListener('click', joinMatchHandler);

        } else if (type === 'error') {
            this.title.textContent = "It seems you are already playing a game elsewhere.";
            this.body.textContent = "Complete that game first or log out to begin a new one. Note that logging out will forfeit any ongoing game.";
            this.addButton(this.footer, 'Close', 'btn', 'btn-secondary', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Close').addEventListener('click', closeModalHandler);
            this.addButton(this.footer, 'Logout', 'btn', 'btn-warning', {'data-bs-dismiss': 'modal'});
            this.buttonMap.get('Logout').addEventListener('click', handleLogout);
        }
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
        const backdrop = document.querySelector('.modal-backdrop.show');
        if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
        }
    }

    addRules() {

        let ul = document.createElement('ul');
        for (let i = 0; i < this.text.length; ++i) {
            let li = document.createElement('li');
            li.textContent = this.text[i];
            ul.appendChild(li);
        }
        this.body.appendChild(ul);
    }

    getTextForEndMenu() {
        if (this.text === pongGame.localUser.name) {
            return "You won!"
        } else {
            return `${this.text} won!`
        }
    }

    addButton(parent, text, ...attributes) {
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.textContent = text;
        for (let attr of attributes) {
            if (typeof attr === 'object' && attr !== null) {
                for (let key in attr) {
                    button.setAttribute(key, attr[key]);
                }
            } else {
                button.classList.add(attr);
            }
        }
        parent.appendChild(button);
        this.buttonMap.set(text, button);
    }

    addSpinner() {
        this.body.classList.add('d-flex', 'justify-content-center', 'align-items-center');
        let spinner = document.createElement("div");
        spinner.classList.add("spinner-border", "text-primary");
        spinner.setAttribute("role", "status");
        // Create visually hidden label for accessibility
        let label = document.createElement("span");
        label.classList.add("visually-hidden");
        label.textContent = "Loading...";
        this.body.appendChild(spinner);
        this.body.appendChild(label);
    }
}