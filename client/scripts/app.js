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

  app.init = function() {
    $(document).ready(function() {
      $('.username').on('click', function() {
        var name = $(this).text();
        app.addFriend(name);

      });

      $('.submit').on('click', function() {
        var username = $('.username').val();
        var message = $('#message').val();
        console.log(message);
        app.handleSubmit(message, username);
        return false;
      });

      setInterval(function() {
        app.fetch();
      }, 8000);

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

    console.log('entered');
    var selection = d3.select('body').select('#chats').selectAll('p').data(messages);
    console.log('selection: ', selection, selection.length);
    console.log('enter: ',selection.enter(), selection.enter().length);
    console.log('exit ', selection.exit(), selection.exit().length);
    selection.enter()
    .append("p")
    .attr('id', 'message')
    .attr('class', function(d) { return d.roomname; })
    .text(function(d) { return d.username + ': ' + d.text; });

  };

  app.messageHandling = function(messages) {

    doneMessages = messages.responseJSON;
    var allCleanMessages = [];

    for (var i = 0; i < doneMessages.results.length; i++) {
      //if(doneMessages.results.indexOf(doneMessages.results[i]) === -1) {
      var cleanMessages = {};
      for (var key in doneMessages.results[i]) {
        cleanMessages[key] = app.escapeRegEx(doneMessages.results[i][key]);

        if (key === 'roomname' && cleanMessages[key].length < 100 && !(app.rooms[cleanMessages[key]])) {
          app.rooms[cleanMessages[key]] = app.rooms[cleanMessages[key]] || [];
          app.rooms[cleanMessages[key]].push(cleanMessages.text);
          app.addRoom(cleanMessages[key]);
        }
      }
      //app.addMessage(cleanMessages);
      allCleanMessages.push(cleanMessages);
    }

    app.displayMessages(allCleanMessages);
  };

  app.escapeRegEx = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, "\\$&");
  };

  app.clearMessages = function() {
    $('#chats').empty();
  };

  app.addMessage = function(message) {
    $('#chats').append('<p class="username">' + message.username + ': ' + message.text + '</p>');
  };

  app.addRoom = function(room) {
    $('#roomSelect').append('<a href="#">' + room + '</a>');

  };

  app.addFriend = function(name) {
    //need to fill
  };

  app.handleSubmit = function(message, username) {
    var messageObject = {};
    messageObject.text = message;
    messageObject.username = username || undefined;
    app.send(messageObject);
    app.fetch();
  };

  var dropdown = function() {
    document.getElementById("roomSelect").classList.toggle("show");
  };
// });

app.init();
