# LINE 群組機器人

第一版會在私聊或群組收到以下文字時回覆：

- `你好`、`哈囉`、`hello`、`hi`
- `ping`

## 本機啟動

需要 Node.js 22 以上。

```bash
npm install
export LINE_CHANNEL_SECRET="你的 Channel secret"
export LINE_CHANNEL_ACCESS_TOKEN="你的 Channel access token"
export LINE_GROUP_ID="要通知的群組 ID"
export AUTOMATION_SECRET="排程呼叫密鑰"
npm start
```

伺服器啟動後，LINE 的 Webhook URL 應設為：

```text
https://你的公開網址/webhook
```

## LINE 後台設定

1. 建立 LINE Official Account，並啟用 Messaging API。
2. 在 Messaging API 頁面取得 `Channel secret` 與 `Channel access token`。
3. 填入公開的 HTTPS Webhook URL，按 `Verify`，再啟用 `Use webhook`。
4. 若要放入群組，開啟 `Allow bot to join group chats`。
5. 建議關閉官方帳號內建的 Greeting message 與 Auto-response，避免重複回覆。

請勿將 `.env` 或任何 token 提交到 Git。

## 每週主動通知

部署後，群組內傳送任一文字會在服務紀錄中顯示 `LINE_GROUP_ID_CANDIDATE`，
將該值設為 `LINE_GROUP_ID`。排程服務以 `POST /weekly-notification` 呼叫，
在 `x-automation-secret` 標頭提供 `AUTOMATION_SECRET`，並傳送 JSON：

```json
{ "message": "本週球局通知內容" }
```
