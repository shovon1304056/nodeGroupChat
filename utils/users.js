const users = [];

// join user to chat

function userJoinChat(id,username,room){
    const user = {
        id : id,
        username : username,
        room : room
    }

    users.push(user);

    return user;
}


// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
  }

// user leaves chat

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1);
    }
}

// get Room user

function getRoomUsers(room){
    return users.filter(user => room === user.room);
}






module.exports = {
    userJoinChat,
    getCurrentUser,
    userLeave,
    getRoomUsers
}