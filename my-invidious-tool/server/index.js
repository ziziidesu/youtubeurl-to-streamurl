const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// 利用可能なInvidiousインスタンスのリスト
const INVIDIOUS_INSTANCES = [
  "https://invidious.qwik.space",
  "https://yt.drgnz.club",
  "https://invidious.privacyredirect.com",
  "https://invidious.jing.rocks",
  "https://iv.datura.network",
  "https://invidious.private.coffee",
  "https://invidious.materialio.us",
  "https://invidious.fdn.fr",
  "https://vid.puffyan.us",
  "https://iteroni.com",
  "https://invidious.private.coffee",
  "https://youtube.privacyplz.org",
  "https://invidious.fdn.fr",
  "https://youtube.mosesmang.com",
  "https://inv.nadeko.net",
  "https://invidious.nerdvpn.de",
  "https://iv.datura.network",
  "https://invidious.perennialte.ch"
];

// CORSを許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// 動画情報を取得する関数（順番に試す）
async function fetchFromInstances(videoId, instances) {
    for (const instance of instances) {
        try {
            // APIリクエストを送る
            const apiResponse = await axios.get(`${instance}/api/v1/videos/${videoId}`);
            return apiResponse.data; // 成功したらデータを返す
        } catch (error) {
            console.error(`Failed to fetch from ${instance}:`, error.message);
            // 次のインスタンスを試す
        }
    }
    throw new Error("All Invidious instances failed");
}

app.get("/stream-url", async (req, res) => {
    const videoUrl = req.query.url;

    // YouTube動画IDを抽出
    const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (!videoIdMatch) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const videoId = videoIdMatch[1];

    try {
        // 順番にインスタンスを試して動画情報を取得
        const videoData = await fetchFromInstances(videoId, INVIDIOUS_INSTANCES);

        // ストリームURLを整形
        const formats = videoData.adaptiveFormats || [];
        const streamUrls = formats.map(format => ({
            quality: format.qualityLabel,
            url: format.url,
        }));

        res.json({ videoId, streamUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
