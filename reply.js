const TRIGGERS = new Set(["你好", "哈囉", "hello", "hi", "ping"]);

function createReply(text) {
  const normalized = text.trim().toLowerCase();

  if (!TRIGGERS.has(normalized)) {
    return null;
  }

  if (normalized === "ping") {
    return "pong 🏓";
  }

  return "哈囉！我是剛做好的 LINE 機器人 🤖";
}

module.exports = { createReply };
