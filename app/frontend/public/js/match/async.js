import config from '../../config.js';
import { pongGame } from './internal.js';

export async function joinMatch() {
    try {
        const message = {
            'type': 'remote',
            'max_score': pongGame.maxScore,
        };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/join-match/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        console.log(data);
        if (data['success'] === false) {
            return false;
        } else {
            pongGame.newMatch(data);
            return true;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function updateMatch(matchId, matchStatus, leftScore, rightScore) {
    try {
        const message =
            {
                'id': matchId,
                'new_status': matchStatus,
                'left_score': leftScore,
                'right_score': rightScore,
            };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/update-match/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
            keepalive: true,
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
            console.error('Error:', error);
    }
}
