///addUser(id, name, room)

//removeUser(id)

//getUser(id)

//getUserList(room)

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room };
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
        const names = users.map(user => user.name);
        return names;
    }
}

module.exports = { Users };
