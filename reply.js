const TRIGGERS = new Set(["你好", "哈囉", "hello", "hi", "ping"]);

const REGISTRATION_WORDS = ["報名", "單兵", "候補", "收單兵"];
const TIME_WORDS = ["何時", "什麼時候", "哪天", "幾點", "開放", "開始", "時間", "本週有開嗎", "這週有開嗎"];
const CALENDAR_QUESTIONS = ["本週有嗎", "這週有嗎", "本週有球嗎", "這週有球嗎", "本週有開嗎", "這週有開嗎", "球局行事曆", "行事曆"];
const CALENDAR_URL = "https://dayuan-legends.v2rc2d7trr.chatgpt.site/history";
const CALENDAR_IMAGE_URL = "https://dayuan-legends.v2rc2d7trr.chatgpt.site/calendar-current.png";

function asksRegistrationTime(text) {
  return (
    REGISTRATION_WORDS.some((word) => text.includes(word)) &&
    TIME_WORDS.some((word) => text.includes(word))
  );
}

function asksForCalendar(text) {
  return CALENDAR_QUESTIONS.some((question) => text.includes(question));
}

function createReply(text) {
  const normalized = text.trim().toLowerCase();

  if (asksRegistrationTime(normalized)) {
    return "單兵報名時間：\n1. 每週四傍晚 5 點開放單兵報名。\n2. 禮拜五確認單兵候補補上。\n3. 候補散打費用 180 元。\n請留意群組最新公告。";
  }

  if (!TRIGGERS.has(normalized)) {
    return null;
  }

  if (normalized === "ping") {
    return "pong 🏓";
  }

  return "哈囉！我是剛做好的 LINE 機器人 🤖";
}

function createMessages(text) {
  const normalized = text.trim().toLowerCase();

  if (asksForCalendar(normalized)) {
    return [
      { type: "image", originalContentUrl: CALENDAR_IMAGE_URL, previewImageUrl: CALENDAR_IMAGE_URL },
      { type: "text", text: `最新球局行事曆：\n${CALENDAR_URL}` },
    ];
  }

  const replyText = createReply(text);
  return replyText ? [{ type: "text", text: replyText }] : null;
}

module.exports = { createMessages, createReply };
