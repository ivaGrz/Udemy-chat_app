class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room, color: this.colorGen() };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let removedUser;
        const users = this.users.filter(user => {
            if (user.id !== id) {
                return true;
            } else {
                removedUser = user;
            }
        });
        this.users = users;
        return removedUser;
    }

    getUser(id) {
        const user = this.users.find(user => user.id === id);
        return user;
    }

    getUserList(room) {
        const users = this.users.filter(user => user.room === room);
        const names = users.map(user => [user.name, user.color]);
        return names;
    }

    colorGen() {
        const h = Math.floor(Math.random() * 300);
        const s = Math.floor(Math.random() * 70) + 30 + '%';
        const l = '50%';
        let color = 'hsl(' + h + ',' + s + ',' + l + ')';
        return color;
    }
}

module.exports = { Users };
