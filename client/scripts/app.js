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
// $(document).ready(function() {
  var app = {};
  app.rooms = {};
  app.friends = {};
  var currentRoom = 'All Messages';

  app.init = function() {
    $(document).ready(function() {
      $('#chats').on('click', '.username', function() {
        var name = $(this).text();
        var name = name.match(/[^:]*/)[0];
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

    });



    //var fetchMessageResponses = fetchMessage.responseJSON;
    //console.log('fetchMessageResponses', fetchMessageResponses);
    // for (var i = 0; i < 10; i++) {
    //   app.addMessage(fetchMessage.results[i]);
    // }
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
    var doneMessages;
    var messages = $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
    //data: JSON.stringify(message), //change the 'test message'
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
      },
      error: function (data) {
            // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message'/*, data*/);
      }
    });

    messages.done(function() {
      app.messageHandling(messages);
    });

    return doneMessages;
  };

  app.displayMessages = function(messages) {

    app.clearMessages();

    var selection = d3.select('#chats')
    .selectAll('div').data(messages, function(d, i) {
      return d.objectId;
    });

    // console.log(selection.enter()[0].length);
    // console.log(selection.exit()[0].length);

    selection.enter()
    .append('div')
    .attr('id', 'message')
    .attr('class', function(d) { 
      // console.log('inside selection.enter()');
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

    doneMessages = messages.responseJSON;
    var allCleanMessages = [];

    for (var i = 0; i < doneMessages.results.length; i++) {
      //if(doneMessages.results.indexOf(doneMessages.results[i]) === -1) {
      var cleanMessages = {};
      for (var key in doneMessages.results[i]) {
        cleanMessages[key] = app.escapeRegEx(doneMessages.results[i][key]);

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
    if (!str){
      return 'Bad Text';
    } 
    return str.replace(/[\-\[\]\/\{\}\\\^\$\|\<\>]/g, "\\$&");
    // return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, "\\$&");
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
    document.getElementById("roomSelect").classList.toggle("show");
  };
// });

app.init();
