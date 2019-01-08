const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: '1',
                name: 'Mike',
                room: 'test'
            },
            {
                id: '2',
                name: 'Jen',
                room: 'test2'
            },
            {
                id: '3',
                name: 'July',
                room: 'test'
            }
        ];
    });

    it('should add new user', () => {
        const users = new Users();
        const user = {
            id: '123',
            name: 'Iva',
            room: 'test'
        };
        const resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should get user July', () => {
        const july = users.getUser('3');

        expect(july).toEqual({ id: '3', name: 'July', room: 'test' });
    });

    it('should remove user July', () => {
        const julyRemoved = users.removeUser('3');
        expect(julyRemoved).toEqual({ id: '3', name: 'July', room: 'test' });
        expect(users.users).toEqual([
            { id: '1', name: 'Mike', room: 'test' },
            { id: '2', name: 'Jen', room: 'test2' }
        ]);
    });

    it('should return names for test room', () => {
        let userList = users.getUserList('test');

        expect(userList).toEqual(['Mike', 'July']);
    });
});
