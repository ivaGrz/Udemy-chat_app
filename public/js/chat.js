var socket = io();

function scrollToBottom() {
    // selectors
    const messages = jQuery('#message-list');
    const newMessage = messages.children('li:last-child');

    //heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (
        clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
        scrollHeight
    ) {
        messages.scrollTop(scrollHeight);
        console.log('should scroll');
    }
}

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(message) {
    const template = $('#message-template').html();

    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        time: moment(message.createdAt).format('H:mm')
    });

    $('#message-list').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    const template = $('#location-message-template').html();

    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        time: moment(message.createdAt).format('H:mm')
    });

    $('#message-list').append(html);
    scrollToBottom();
});

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
