var socket = io();
mapboxgl.accessToken =
    'pk.eyJ1IjoiaXZhZ3J6IiwiYSI6ImNqazE1bTg3aTBjdXAzanM0emRkcXd2YW4ifQ.7iVkqAmMK6tK_qDZaeERBQ';

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
    let data;
    if (message.location) {
        data = `<div id="${message.id}" style="width: 100px; height: 100px;"/>`;
        notifyMe(message.from, 'Location');
    } else {
        data = message.text;
        notifyMe(message.from, message.text);
    }

    let html = Mustache.render(template, {
        from: message.from,
        text: data,
        time: moment(message.createdAt).format('H:mm'),
        color: message.color
    });
    $('#message-list').append(html);
    renderMap(message.id, message.lon, message.lat);
    scrollToBottom();
});

socket.on('meMessage', function(message) {
    const template = $('#me-message-template').html();
    let data;
    if (message.location) {
        data = `<div id="${message.id}" style="width: 100px; height: 100px;"/>`;
        notifyMe(message.from, 'Location');
    } else {
        data = message.text;
        notifyMe(message.from, message.text);
    }

    let html = Mustache.render(template, {
        from: message.from,
        text: data,
        time: moment(message.createdAt).format('H:mm'),
        color: message.color
    });
    $('#message-list').append(html);
    scrollToBottom();
    renderMap(message.id, message.lon, message.lat);
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

function notifyMe(from, content) {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
        var notification = new Notification(from, {
            icon: '...',
            body: content
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                var notification = new Notification(from, {
                    icon: '...',
                    body: content
                });
            }
        });
    }
}

function renderMap(mapId, lng, lat) {
    let map = new mapboxgl.Map({
        container: mapId,
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [lng, lat],
        zoom: 13
    });
    var el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
}
