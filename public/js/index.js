var socket = io();
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(message) {
    console.log('New Message: ', message);
    let username = message.from;
    let text = message.text;

    // if (username != 'Admin') {
    //     username = $('#username').val();
    // }

    $('#message-list').append(`<li>${username}: ${text}</li>`);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

// socket.emit(
//     'createMessage',
//     {
//         from: 'Frank',
//         text: 'Hy'
//     },
//     function(data) {
//         console.log('Got it! ', data);
//     }
// );

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit(
        'createMessage',
        {
            from: 'User',
            text: $('#message').val()
        },
        function() {}
    );
});
