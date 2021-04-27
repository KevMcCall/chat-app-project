const users = [];

// Join user to chat //
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get Current User //
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


// User Leaves Chat //
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

// Removing 1 From the Index When User Leaves //
    if(index !== -1) {
      return users.splice(index, 1)[0];  
    }
}

// Get Users From Room //
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}



module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
