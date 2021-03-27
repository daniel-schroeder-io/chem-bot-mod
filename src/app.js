require('dotenv').config()
const axios = require('axios');
const tmi = require('tmi.js');

let wincount = 0;

const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: process.env.USERNAME,
		password: process.env.TWITCH_TOKEN
	},
	channels: [ process.env.CHANNEL ]
});
var minutes = 1;
var the_interval = minutes * 60 * 1000;

client.connect();
client.on('message', (channel, userstate, message, self) => {

  setInterval(function() {
    client.say(channel, `POGGERS! POGGERS! POGGERS! GIVE ${process.env.BROADCASTER_TAG} SOME HYPE!`);
  }, the_interval);

	// Ignore echoed messages.
	if(self) return;

  // If i get tagged, tell people what to do
  if(message === `@${process.env.USERNAME}`) {
    client.say(channel, `Hey beautiful :)`);
  }

  if(message.toLowerCase() === '!wins') {
    if(userstate.mod){
      client.say(channel, `${process.env.BROADCASTER_TAG} has won ${wincount} games!`);
    }
  }

  if(message.toLowerCase() === '!addwin') {
    if(userstate.mod){
      wincount++;
      client.deletemessage(channel, userstate.id)
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    }
  }

  // Music Plug
  if(message.toLowerCase() === '!music') {
    client.say(channel, `Check out ${process.env.BROADCASTER_TAG} on SoundCloud ${process.env.SOUNDCLOUD} and Spotify ${process.env.SPOTIFY}`);
  }
  
	if(message.toLowerCase() === '!number') {
		// "@alca, heya!"
    axios.get('http://numbersapi.com/random/trivia')
    .then(function (response) {
      // handle success
      console.log(response.data)
      client.say(channel, response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
	}
});