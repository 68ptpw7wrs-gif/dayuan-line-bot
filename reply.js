const TRIGGERS = new Set(["你好", "哈囉", "hello", "hi", "ping"]);

const REGISTRATION_WORDS = ["報名", "單兵", "候補", "收單兵"];
const TIME_WORDS = ["何時", "什麼時候", "哪天", "幾點", "開放", "開始", "時間", "本週有開嗎", "這週有開嗎"];

function asksRegistrationTime(text) {
  return (
    REGISTRATION_WORDS.some((word) => text.includes(word)) &&
    TIME_WORDS.some((word) => text.includes(word))
  );
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

module.exports = { createReply };
