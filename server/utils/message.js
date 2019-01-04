const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

const generateLocationMessage = (from, lat, lon) => {
    let url = `https://maps.google.com/?q=${lat},${lon}`;
    return {
        from,
        url,
        createdAt: moment().valueOf()
    };
};

module.exports = { generateMessage, generateLocationMessage };
