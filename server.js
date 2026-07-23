const express = require("express");
const { messagingApi, middleware } = require("@line/bot-sdk");
const { createReply } = require("./reply");

const channelSecret = process.env.LINE_CHANNEL_SECRET;
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!channelSecret || !channelAccessToken) {
  console.error("缺少 LINE_CHANNEL_SECRET 或 LINE_CHANNEL_ACCESS_TOKEN 環境變數。");
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT) || 3000;
const client = new messagingApi.MessagingApiClient({ channelAccessToken });

app.get("/", (_req, res) => {
  res.status(200).send("LINE bot is running");
});

app.post("/webhook", middleware({ channelSecret }), async (req, res) => {
  res.sendStatus(200);

  const results = await Promise.allSettled(req.body.events.map(handleEvent));
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("處理 LINE 事件失敗：", result.reason);
    }
  });
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const replyText = createReply(event.message.text);
  if (!replyText) {
    return;
  }

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: "text", text: replyText }]
  });
}

app.use((error, _req, res, _next) => {
  console.error("Webhook 驗證或伺服器錯誤：", error);
  if (!res.headersSent) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`LINE bot listening on port ${port}`);
});
