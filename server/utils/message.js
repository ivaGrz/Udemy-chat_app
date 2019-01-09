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
    //     let url = `https://maps.google.com/?q=${lat},${lon}`;

    //     var img_url = `https://maps.googleapis.com/maps/api/staticmap?center=
    //   ${lat}${lon}&zoom=14&size=400x300&sensor=false`;
    //     let text = `<img src=${img_url}/>`;

    return {
        id: 'map-' + Math.floor(Math.random() * 10000),
        from,
        // text,
        lon,
        lat,
        color,
        createdAt: moment().valueOf(),
        location: true
    };
};

module.exports = { generateMessage, generateLocationMessage };
