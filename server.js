const express = require("express");
const ytdlp = require("yt-dlp-exec");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ service: "KIRU-MUSIC API", status: "running" });
});

app.get("/audio", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ error: "No URL provided" });

    try {
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
        });

        res.json({
            title: info.title,
            duration: info.duration,
            thumbnail: info.thumbnail,
            audio: info.url,
            requested_by: "KIRU-MUSIC"
        });

    } catch (err) {
        res.json({ error: "Failed to fetch audio" });
    }
});

app.listen(PORT, () => console.log(`🎵 KIRU-MUSIC API running on port ${PORT}`));
