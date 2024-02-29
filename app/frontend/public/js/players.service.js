import config from '../config.js'

const PLAYERS_API = config.BACKEND_URL + '/players/';

export default class PlayersService {

  static async getList() {
    return await fetch(PLAYERS_API + 'list', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async getDetail(id) {
    return await fetch(PLAYERS_API + 'detail/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async search(name) {
    return await fetch(PLAYERS_API + 'search/' + name, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async getFriendsList() {
    return await fetch(PLAYERS_API + 'friends/list', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async friendRequest(id){
    return await fetch(PLAYERS_API + 'friend-requests/' + id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async sentFriendRequest(){
    return await fetch(PLAYERS_API + 'friend-requests/sent', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async receivedFriendRequests(){
    return await fetch(PLAYERS_API + 'friend-requests/recieved', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async friendRequestAccept(id){
    return await fetch(PLAYERS_API + 'friend-requests/accept/' + id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  static async friendRequestReject(id){
    return await fetch(PLAYERS_API + 'players/friend-requests/reject/' + id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }
}