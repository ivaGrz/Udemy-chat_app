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
    // console.log('Connected to server');
    const params = jQuery.deparam(window.location.search);
    $('#room-name').text(params.room);
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
        }
    });
});

socket.on('adminMessage', function(message) {
    let adminMsg = $('<h5 class="admin-msg"></h5>');
    adminMsg.text(message);
    $('#message-list').append(adminMsg);
});

socket.on('newMessage', function(message) {
    const template = $('#message-template').html();

    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        time: moment(message.createdAt).format('H:mm'),
        color: message.color
    });

    $('#message-list').append(html);
    scrollToBottom();
    var notification = new Notification(`${message.from}: ${message.text}`);
});

// socket.on('generated notification', notificationString => {
//     // show the notification
//     var notification = new Notification(notificationString);
// });

socket.on('meMessage', function(message) {
    const template = $('#me-message-template').html();

    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        time: moment(message.createdAt).format('H:mm'),
        color: message.color
    });

    $('#message-list').append(html);
    scrollToBottom();
});

// socket.on('newLocationMessage', function(message) {
//     const template = $('#location-message-template').html();

//     let html = Mustache.render(template, {
//         from: message.from,
//         url: message.url,
//         time: moment(message.createdAt).format('H:mm'),
//         color: message.color
//     });

//     $('#message-list').append(html);
//     scrollToBottom();
// });

socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($(`<li style="color:${user[1]}"></li>`).text(user[0]));
    });
    $('#users').html(ol);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit(
        'createMessage',
        {
            text: $('#message').val(),
            id: socket.id
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
