const moment = require('moment');

const generateMessage = (from, text, color) => {
    return {
        from,
        text,
        color,
        createdAt: moment().valueOf()
    };
};

const generateLocationMessage = (from, lat, lon, color) => {
    let url = `https://maps.google.com/?q=${lat},${lon}`;
    let text = `<a href="${url}" target="_blank">
            <i class="fas fa-map-marker-alt" />
        </a>`;
    return {
        from,
        text,
        color,
        createdAt: moment().valueOf()
    };
};

module.exports = { generateMessage, generateLocationMessage };
