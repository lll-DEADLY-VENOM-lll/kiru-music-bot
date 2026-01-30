const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🎧 Welcome to KIRU-MUSIC!\nUse /play song name");
});

bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    bot.sendMessage(chatId, "🔍 Searching song...");

    try {
        const searchUrl = `https://ytsearch-api.vercel.app/search?q=${encodeURIComponent(query)}`;
        const search = await axios.get(searchUrl);

        if (!search.data.videos.length) {
            return bot.sendMessage(chatId, "❌ Song not found");
        }

        const videoUrl = search.data.videos[0].url;

        const api = await axios.get(`https://api.kiru-music.si/audio?url=${videoUrl}`);

        bot.sendAudio(chatId, api.data.audio, {
            title: api.data.title,
            thumb: api.data.thumbnail
        });

    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Error while fetching song");
    }
});

