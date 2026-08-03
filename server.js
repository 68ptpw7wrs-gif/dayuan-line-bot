const express = require("express");
const crypto = require("crypto");
const { messagingApi, middleware } = require("@line/bot-sdk");
const { createMessages } = require("./reply");

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

function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

app.post("/weekly-notification", express.json({ limit: "16kb" }), async (req, res, next) => {
  const automationSecret = process.env.AUTOMATION_SECRET;
  const groupId = process.env.LINE_GROUP_ID;

  if (!automationSecret || !groupId) {
    return res.status(503).json({ error: "Weekly notification is not configured." });
  }

  if (!secretsMatch(req.get("x-automation-secret"), automationSecret)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 5000) {
    return res.status(400).json({ error: "A message of 1–5000 characters is required." });
  }

  try {
    await client.pushMessage({
      to: groupId,
      messages: [{ type: "text", text: message }]
    });
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
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
  if (event.source?.type === "group" && event.source.groupId) {
    console.log(`LINE_GROUP_ID_CANDIDATE=${event.source.groupId}`);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const messages = createMessages(event.message.text);
  if (!messages) {
    return;
  }

  await client.replyMessage({
    replyToken: event.replyToken,
    messages
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
