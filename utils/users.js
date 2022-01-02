const users = [];

// join user to chat

function userJoinChat(id,userName,room){
    const user = {
        id : id,
        userName : userName,
        room : room
    }

    users.push(user);

    return user;
}


// get the current user

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    userJoinChat,
    getCurrentUser
}