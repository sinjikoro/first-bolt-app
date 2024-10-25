const { App } = require('@slack/bolt');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    // ソケットモードではポートをリッスンしませんが、アプリを OAuth フローに対応させる場合、
    // 何らかのポートをリッスンする必要があります
    port: process.env.PORT || 3000
});

// "hello" を含むメッセージをリッスンします
app.message('hello', async ({ message, say }) => {
    // イベントがトリガーされたチャンネルに say() でメッセージを送信します
    await say(`Hey there <@${message.user}>!`);
});

(async () => {
    // アプリを起動します
    await app.start();

    console.log('⚡️ Bolt app is running!');
})();

// open_modal というグローバルショートカットはシンプルなモーダルを開く
app.shortcut('distribute_app', async ({ shortcut, ack, context, logger }) => {
    // グローバルショートカットリクエストの確認
    ack();

    try {
        // 組み込みの WebClient を使って views.open API メソッドを呼び出す
        const result = await app.client.views.open({
            // `context` オブジェクトに保持されたトークンを使用
            token: context.botToken,
            trigger_id: shortcut.trigger_id,
            view: {
                "type": "modal",
                "title": {
                    "type": "plain_text",
                    "text": "アプリ配信するよー"
                },
                "submit": {
                    "type": "plain_text",
                    "text": "はいしん！"
                },
                "close": {
                    "type": "plain_text",
                    "text": "やめる！！"
                },
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "アプリ配信するぜ :runner::runner::runner:"
                        }
                    },
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "v1.10.0"
                            }
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "配信バージョン",
                            "emoji": false
                        }
                    },
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "local"
                            }
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "環境(env)ファイル",
                            "emoji": false
                        }
                    },
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "multiline": true,
                            "placeholder": {
                                "type": "plain_text",
                                "text": "shin@gmail.com\nnaga@gmail.com"
                            }
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "配信先",
                            "emoji": false
                        }
                    }
                ]
            }
        });

        logger.info(result);
    }
    catch (error) {
        logger.error(error);
    }
});