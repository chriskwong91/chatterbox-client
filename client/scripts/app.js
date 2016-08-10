// YOUR CODE HERE:

//receive the input that the user provides into here
	//*not sure how we can continue to get users input, but do so.
	//display them to the screen in order to our index.html (possibly with d3?)

//provide a box for the user to enter type and enter chats
	//possibly use d3 here

//things to consider
	//how to refresh the page
	//allow the user to select a username for themselves to send messages as
	//escaping their input
	//allow users to create and enter rooms

var app = {
  rooms: {},
  friends: {},
};
var currentRoom = 'All Messages';

app.init = function() {
  $(document).ready(function() {
    $('#chats').on('click', '.username', function() {
      var name = $(this).text();
      // var name = name.match(/[^:]*/)[0];
      app.addFriend(name);
      console.log('clicked name is', name);

    });

    $('.submit').on('click', function() {
      var username = $('.username').val();
      var message = $('#message').val();
      app.handleSubmit(message, username);
      return false;
    });

    $('#roomSelect').on('click', '.room', function() {
      var dropClicked = $(this).text();

      if (dropClicked === '--add a room--') {
        var roomName = window.prompt('Enter name of room.');
        var message = {roomname: roomName};
        app.send(message);
        currentRoom = roomName;
      } else {
        currentRoom = dropClicked;
      }
      dropdown();
      $('.roomShow').text('You are currently in room: ' + currentRoom);
    });

    setInterval(function() {
      app.fetch();
    }, 1000);

    // setInterval(function() {
    //   app.send({username: ' :0-) ', text: 'this is a scripted message sent every 20 seconds: <(o.o)>'});
    // }, 20000);

  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message), //change the 'test message'
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message'/*, data*/);
    }
  });
};

app.fetch = function() {

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
  //data: JSON.stringify(message), //change the 'test message'
    contentType: 'application/json',
    success: function (data) {
      app.messageHandling(data);

    },
    error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message'/*, data*/);
    }
  });

};

app.fetchRoom = function(roomname) {
  var room = JSON.stringify(roomname);
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
  //data: JSON.stringify(message), //change the 'test message'
    contentType: 'application/json',
    data: 'where={" ": ' + room + '}', 
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message'/*, data*/);
    }
  });

};

app.displayMessages = function(messages) {

  app.clearMessages();

  var selection = d3.select('#chats')
  .selectAll('p').data(messages, function(d, i) {
    return d.objectId;
  });

  selection.enter()
  .append('p')
  .attr('id', 'message')
  .attr('class', function(d) { 
    return d.roomname + ' username'; 
  })
  .style('font-weight', function(d) { 
    if (app.friends[d.username]) {
      return 'bold';
    } else {
      return 'normal';
    } 
  })
  .text(function(d) { return d.username + ': ' + d.text; });

  selection.exit().remove();
};

app.messageHandling = function(messages) {

  doneMessages = messages;
  var allCleanMessages = [];

  for (var i = 0; i < doneMessages.results.length; i++) {
    //if(doneMessages.results.indexOf(doneMessages.results[i]) === -1) {
    var cleanMessages = {};
    for (var key in doneMessages.results[i]) {
      cleanMessages[key] = app.escapeRegEx(doneMessages.results[i][key]);
      // cleanMessages[key] = doneMessages.results[i][key];
      //Adding unique roomnames to our Room List
      if (key === 'roomname' && cleanMessages[key].length < 100 && !(app.rooms[cleanMessages[key]])) {
        app.rooms[cleanMessages[key]] = app.rooms[cleanMessages[key]] || [];
        app.rooms[cleanMessages[key]].push(cleanMessages.text); //maybe remove (?)
        app.addRoom(cleanMessages[key]);
      }

    }
    //app.addMessage(cleanMessages);
    if (cleanMessages.roomname === currentRoom) {
      allCleanMessages.push(cleanMessages);
    } else if (currentRoom === 'All Messages') {
      allCleanMessages.push(cleanMessages);
    }
  }

  app.displayMessages(allCleanMessages);
};

app.escapeRegEx = function(str) {
  // if (!str){
  //   return 'Bad Text';
  // } 
  // return str.replace(/[\-\[\]\/\{\}\\\^\$\|\<\>]/g, "\\$&");
  // return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, "\\$&");
  return str || 'bad str';
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  $('#chats').append('<p class="username">' + message.username + ': ' + message.text + '</p>');
};

app.addRoom = function(room) {
  $('#roomSelect').append('<a href="#" class="room">' + room + '</a>');

};

app.addFriend = function(name) {
  console.log('adding no friends', name);
  if (!app.friends[name]) {
    app.friends[name] = name;
  }
};

app.handleSubmit = function(message, username) {
  var messageObject = {};
  messageObject.text = message;
  messageObject.username = username || undefined;
  messageObject.roomname = currentRoom === 'All Messages' ? null : currentRoom;
  app.send(messageObject);
  app.fetch();
};

var dropdown = function() {
  document.getElementById('roomSelect').classList.toggle("show");
};




