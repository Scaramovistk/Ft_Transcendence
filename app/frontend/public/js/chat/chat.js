var messages = document.querySelector('.list-group')
var btn = document.querySelector('.btn')
var input = document.querySelector('input')

btn.addEventListener('click', sendMessage)
input.addEventListener('keyup', function(e){ if(e.keyCode == 13) sendMessage() })

function sendMessage(){
   var msg = input.value;
   input.value = ''
   writeLine(msg)
}
function addMessage(e){
   var msg = e.data ? JSON.parse(e.data) : e;
   writeLine(`${msg.FROM}: ${msg.MESSAGE}`)
}
function writeLine(text){
   var message = document.createElement('li')
   message.classList.add('list-group-item', 'list-group-item-secondary')
   message.innerHTML = 'Me: ' + text
   messages.appendChild(message)
   messages.scrollTop = messages.scrollHeight;
}