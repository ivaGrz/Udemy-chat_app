const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: Date.now()
    };
};

const generateLocationMessage = (from, lat, lon) => {
    let url = `https://maps.google.com/?q=${lat},${lon}`;
    return {
        from,
        url,
        createdAt: Date.now()
    };
};

module.exports = { generateMessage, generateLocationMessage };
