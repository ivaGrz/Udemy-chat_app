var socket = io();
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(message) {
    console.log('New Message: ', message);
    let li = $('<li></li>');
    li.append(`<span class="chat-username">${message.from}</span> `);

    // if (message.from === $('#username').val()) {
    //     console.log('color test');
    //     li.attr('css', { color: 'red' });
    // }

    if (message.url) {
        const a = $(
            '<a target="_blank" ><i class="fas fa-map-marker-alt"></i></a>'
        );
        a.attr('href', message.url);
        li.append(a);
    } else if (message.text) {
        const text = $('<span></span>');
        text.text(message.text);
        li.append(text);
    }

    let time = $('<span class="time" ></span>');
    time.text(`${moment(message.createdAt).format('H:mm')}`);
    li.append(time);
    $('#message-list').append(li);
});

// socket.on('newLocationMessage', function(message) {
//     const li = $('<li></li>');
//     li.text(`${message.from}: `);

//     const a = $('<a target="_blank" >Location</a>');
//     a.attr('href', message.url);
//     li.append(a);
//     let time = $('<span class="time" ></span>');
//     time.text(`${moment(message.createdAt).format('H:mm')}`);
//     li.append(time);
//     $('#message-list').append(li);
// });

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

let username = 'user';
let color = $('#username').on('change', function(e) {
    username = $('#username').val();
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit(
        'createMessage',
        {
            from: username,
            text: $('#message').val()
        },
        function() {
            $('#message').val('');
        }
    );
});

$('#send-location').on('click', function(e) {
    e.preventDefault();

    $('#send-location')
        .attr('disabled', 'true')
        .text('Sending location...');

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                $('#send-location')
                    .removeAttr('disabled')
                    .text('Send location');

                socket.emit('createLocationMessage', {
                    from: username,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            function() {
                $('#send-location')
                    .removeAttr('disabled')
                    .text('Send location');
                alert("Don't have permission to fetch geolocation.");
            }
        );
    } else {
        return alert('Geolocation is not supported by your browser.');
    }
});
