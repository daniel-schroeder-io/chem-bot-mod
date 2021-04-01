
const { getLastStreamedGameByName } = require('./api');
require('dotenv').config()
const axios = require('axios');
const tmi = require('tmi.js');
const fs = require('fs');
 
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
const shoutoutRegex = /(!so) (@[a-zA-Z]+)/g;
const addQuoteRegex = /(!addquote) [a-zA-Z ]+/g;

client.connect();

client.on('message', async (channel, userstate, message, self) => {

	// Ignore echoed messages.
	if(self) return;

  if(message.toLowerCase() === "!help"){
    client.say(channel, 
     `
     !so [@user] - shoutout a fellow twitch streamer |
     !addquote [quote] - add a new quote to the list |
     !quote - display a random quote from the list |
     !pc / !specs - check out King Chemist's set up and equipment |
     !waterbottle - check out King Chemist's REUSABLE, SUSTAINABLE water bottle setup |
     !music - Check out King Chemist's music links
     `);
  }


  if(message.match(addQuoteRegex))
  { 
    let quotes = JSON.parse(fs.readFileSync('./assets/quotes.json')); 
    var date = new Date(0);
    date.setUTCSeconds(Date.now());
    let newQuote = { 
      value: message.split('!addquote ')[1],
      dateCreated: date.toLocaleString(), 
      createdBy: userstate['display-name']
    };
    quotes.push(newQuote);
    fs.writeFileSync('./assets/quotes.json', JSON.stringify(quotes)); 
  }


  if(message.toLowerCase() === '!quote')
  {
    let quotes = JSON.parse(fs.readFileSync('./assets/quotes.json')); 
    let q = quotes[Math.floor(Math.random() * quotes.length)];
    client.say(channel, q.value);
  }

  
  //shoutout
  if(message.match(shoutoutRegex))
  {
    var t = message.match(shoutoutRegex)
    var name = t[0].split('@')[1];
    let game = await getLastStreamedGameByName(name);
    if (game[1] == null) {
      client.say(channel,
        `Make sure to check out Chem’s homie @${name}, ${game[0]}`
        );
    }
    else {
      client.say(channel,
        `Make sure to check out Chem’s homie @${name}, they have been playing some ${game[1]}! ${game[0]}`
        );
    }
  } 


  if(message.toLowerCase() === '!pc' || message.toLowerCase() === '!specs')
  {
    client.say(channel, 
      `AMD Ryzen 5 3600 |
      MSI NVIDIA GTX 1660ti |
      G Skillz Ripjaws V Series 3200 MHz DDR4 16 GB memory |
      Samsung EVO 1 TB SSD  |
      Seagate Barracuta 2 TB HDD |
      Be Quiet! BK008 Pure Rock Slim CPU Cooler |
      Corsair RM650x Power Supply`)
  }

  if(message.toLowerCase() === '!waterbottle')
  {
    client.say(channel, `Stone Brewing Hydroflask: https://shop.stonebrewing.com/hydro-flask-sbc-growler-40oz-003379 
    With Stones Throw sticker: https://www.amazon.com/Stones-Throw-Logo-Sticker/dp/B00CNVJRNK `); 
  }

  // If i get tagged, tell people what to do
  if(message.toLowerCase().includes(`@${process.env.USERNAME.toLowerCase()}`)) {
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