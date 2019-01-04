var socket = io();
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(message) {
    console.log('New Message: ', message);

    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#message-list').append(li);
});

socket.on('newLocationMessage', function(message) {
    const li = $('<li></li>');
    const a = $('<a target="_blank" >Location</a>');
    a.attr('href', message.url);
    li.text(`${message.from}: `);
    li.append(a);
    $('#message-list').append(li);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit(
        'createMessage',
        {
            from: 'User',
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
