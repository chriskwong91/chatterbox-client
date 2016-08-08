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

var app = {};

app.init = function() {
	//
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
			  //url: 'https://api.parse.com/1/classes/messages',
			  type: 'GET',
			  //data: JSON.stringify(message), //change the 'test message'
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

app.clearMessages = function() {
	$('#chats').remove();
};

app.addMessage = function(message) {
		//.text appends the text first and escapes the script tag
		//then afterwards, create another div.chats 
	$('#chats').text(message.text);
	$('#chats').appendTo()

	$('#main').append('<div>' + message + '</div>'); //erased the .attr part
	//console.log('<div>' + message.text + '<div>');
}





