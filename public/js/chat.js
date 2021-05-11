const socket = io()

// // Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


// // Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageHistoryTemplate = document.querySelector('#message-history-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const sidebarChatRoomsTemplate = document.querySelector('#sidebar-chat-rooms-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message.sentBy.name)
    const html = Mustache.render(messageTemplate, {
        username: message.sentBy.name,
        message: message.data,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('currentRoomMessages', ({ room, data }) => {
    const html = Mustache.render(messageHistoryTemplate, {
        messages: data.filter(d => d.createdAt = moment(d.createdAt).format('h:mm a'))
    })
    $messages.innerHTML = ''
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})


function startChat(){
  document.querySelector('.rooms').addEventListener('click', (e) => {
    e.preventDefault()
    const _id = e.target.getAttribute('data-id');

    socket.emit('join', { room: _id  }, (error) => {
        if (error) {
            alert(error)
            // location.href = '/'
        }
        Array.from(document.getElementsByClassName('room')).forEach(function(el) { 
            el.classList.remove('active');
        });
        e.target.classList.add('active')
    
        document.querySelector('.room-name').innerHTML = e.target.textContent
        document.querySelector('.chat__main').style.removeProperty('display')
    })
  });
}


  fetch('/apis/rooms')
  .then((response) => {
    response.json()
    .then((data) => {
      console.log(data.rooms)
        const html = Mustache.render(sidebarChatRoomsTemplate, {
            rooms: data.rooms
        })
        document.querySelector('#sidebar .chat__rooms').innerHTML = html
        startChat()
    });
  }).then(data => console.log(data));

  document.querySelector('.logout').addEventListener('click', (e) => {
    e.preventDefault()
    postData('/apis/users/logout', {}, 'POST')
	.then((response) => {
		if (response.status) {
			window.location = 'login'
		} else {
			throw new Error('Something went wrong');
		}
	}, 'POST').catch(err => {
		alert(err);
	});
  });