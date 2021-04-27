const moment = require('moment');


function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().calendar('h:mm: a')
    }
}

module.exports = formatMessage;