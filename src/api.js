require('dotenv').config()
const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

module.exports = { 
  getLastStreamedGameByName: async (name) => {
    let user = await apiClient.kraken.users.getUserByName(name);
    let channel = await apiClient.kraken.channels.getChannel(user.id);
    return [channel.url, channel.game];
  } 
 };