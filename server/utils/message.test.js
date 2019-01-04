const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'Jen';
        const text = 'Some message';
        const message = generateMessage(from, text);

        expect(message.createdAt).toBeGreaterThan(0);
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Jen';
        const lat = 1;
        const lon = 1;
        const url = 'https://maps.google.com/?q=1,1';
        const message = generateLocationMessage(from, lat, lon);

        expect(message.url).toBe(url);
        expect(message.createdAt).toBeGreaterThan(0);
        expect(message.from).toBe(from);
    });
});
