const TRIGGERS = new Set(["你好", "哈囉", "hello", "hi", "ping"]);

const REGISTRATION_WORDS = ["報名", "單兵", "候補", "收單兵"];
const TIME_WORDS = ["何時", "什麼時候", "哪天", "幾點", "開放", "開始", "時間", "規則", "流程", "怎麼報", "本週有開嗎", "這週有開嗎"];
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
    return "🏀 每週報名規則\n\n1. 週三 17:00｜季繳會員開始登記，LINE 發送報名連結。\n2. 週四 17:00｜單兵開始候補，LINE 發送報名連結。\n3. 週五 17:00｜依空缺遞補單兵，確認並公布名單。\n4. 球局當天｜已報到的人員才會進入分隊。\n\n單兵費用：每場 180 元。\n若公告臨時調整，以群組最新訊息為準。";
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
