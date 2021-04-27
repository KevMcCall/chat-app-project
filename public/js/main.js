// Access Chat Form //
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// For Websocket Connection Output //
const socket = io();

// Catch Emit on Client Side //
    socket.on('message', message => {
    console.log(message);
    outputMessage(message);

// Scroll Down On Message //
   chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Get Username and Room From URL //
    const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Join Chat //
    socket.emit('joinRoom', { username, room});

// Get Room and Users //
    socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Submit Message //
chatForm.addEventListener('submit', (e) => {

// Prevent Form From Submitting To a File //
    e.preventDefault();

// Get Text Input //
    const msg = e.target.elements.msg.value;

// Emit Message to Server //
    socket.emit('chatMessage', msg);

// Clear Input After Message Sent //
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// Output Message to DOM //
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// ADD Room Name to DOM //
function outputRoomName(room) {
    roomName.innerText = room;
}

// ADD Users to DOM //
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}