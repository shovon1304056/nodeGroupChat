const moment = require('moment');

function dynamicFormatMessage(username,text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = dynamicFormatMessage;

