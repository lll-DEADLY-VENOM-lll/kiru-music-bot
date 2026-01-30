const { Telegraf } = require('telegraf');
const ytDlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const BOT_TOKEN = "8430243128:AAFBU_m71pyMSw6MRk_Alut7huZK6uqK3EU";
const bot = new Telegraf(BOT_TOKEN);

console.log("Bot is starting...");

bot.start((ctx) => ctx.reply('Welcome! Mujhe YouTube link bhejo, main usse Music file bana kar bhejunga.'));

bot.on('text', async (ctx) => {
    const url = ctx.message.text;

    // Check agar link YouTube ka hai
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return ctx.reply('Please valid YouTube link bhejein!');
    }

    const msg = await ctx.reply('Processing... Music download ho raha hai, please wait.');

    try {
        const timestamp = Date.now();
        const outputPath = path.join(__dirname, `${timestamp}.mp3`);

        // yt-dlp ka use karke Best Audio download karna
        await ytDlp(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputPath,
            noCheckCertificates: true,
        });

        // Music file ki details fetch karna (Title & Thumbnail ke liye)
        const info = await ytDlp(url, {
            dumpSingleJson: true,
        });

        // Telegram par audio file bhejna
        await ctx.replyWithAudio({ source: outputPath }, {
            title: info.title,
            performer: info.uploader,
            caption: `🎵 *Title:* ${info.title}\n👤 *Uploader:* ${info.uploader}\n\n✅ Uploaded via MyBot`,
            parse_mode: 'Markdown'
        });

        // Server se file delete karna (space bachane ke liye)
        fs.unlinkSync(outputPath);
        ctx.deleteMessage(msg.message_id);

    } catch (error) {
        console.error(error);
        ctx.reply('❌ Error: Video download nahi ho saki. Shayad link galat hai ya video age-restricted hai.');
    }
});

bot.launch();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
