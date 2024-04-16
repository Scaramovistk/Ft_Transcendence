import { pongGame, Menu, joinMatch, updateMatch } from './internal.js';
import { logout } from '../auth.js';

const navbarButton = document.querySelector('.navbar-brand');

function handleLeaving(event) {
    if (pongGame.matchId === null) {
        return ;
    }
    if (!pongGame.isRunning) {
        updateMatch(pongGame.matchId, pongGame.matchStatus.cancel, 0, 0);
    }
    else {
        let winner;
        if (pongGame.localUser.side === "left") {
            pongGame.rightPlayer.score = pongGame.maxScore;
            winner = pongGame.rightPlayer.name;
        } else {
            pongGame.leftPlayer.score = pongGame.maxScore;
            winner = pongGame.leftPlayer.name;
        }
        if (pongGame.mySocket !== null) {
            pongGame.mySocket.close(1000);
            pongGame.mySocket = null;
        }
        updateMatch(pongGame.matchId, pongGame.matchStatus.finish, pongGame.leftPlayer.score, pongGame.rightPlayer.score);
    }
    pongGame.removeGameInputEvents();
}

export function handleHashChange(event) {
    handleLeaving(event);
    window.removeEventListener('hashchange', handleHashChange);
}

export function handleNavBarButton(event) {
    handleLeaving(event);
    window.location.href = this.getAttribute('href');
    navbarButton.removeEventListener('click', handleNavBarButton);
}

export function handleRefreshButton(event) {
    handleLeaving(event);
    window.removeEventListener('beforeunload', handleRefreshButton);
}

export function handleLogout(event) {
    pongGame.menu.hide('error');
    logout();
}

function handleOnKey(event, key, isPressedOrNot) {
    event.preventDefault();
    let player;
    if (pongGame.leftPlayer.name === pongGame.localUser.name) {
        player = pongGame.leftPlayer;
    } else {
        player = pongGame.rightPlayer;
    }
    switch (key) {
        case 'w':
            player.inputUp = isPressedOrNot;
            break;
        case 's':
            player.inputDown = isPressedOrNot;
            break;
    }
}

export function handleKeyDown(event) {
    return handleOnKey(event, event.key, true);
}

export function handleKeyUp(event) {
    return handleOnKey(event, event.key, false);
}

export function closeModalHandler(event) {
    pongGame.menu.hide();
}

export async function joinMatchHandler(event) {
    if (pongGame.scoreBoard) {
        pongGame.scoreBoard.hide();
    }
    const res = await joinMatch();
    pongGame.menu.hide('start');
    if (res === false) {
        pongGame.menu = new Menu('error');
        pongGame.menu.show('error');
    } else {
        pongGame.menu = new Menu('wait');
        pongGame.menu.show('wait');
    }
}

export function stopWaitingHandler(event) {
    updateMatch(pongGame.matchId, pongGame.matchStatus.cancel, 0, 0);
    pongGame.menu.hide('wait');
}