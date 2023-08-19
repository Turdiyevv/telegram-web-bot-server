const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')
const {request, response} = require("express");

const token = '5620508368:AAEqHMVLadLrWQlO2kRo1EtCT8uUinfUw5c'
const bot = new TelegramBot(token, {polling: true});

const app = express()
app.use(express.json());
app.use(cors());

const bootstrap = () => {

    bot.setMyCommands([
        {command: "/start", description: "Kurslar haqida ma'lumot"},
        {command: "/help", description: "Kurslarni sotob oling"}
    ]);

    bot.on("message", async msg => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === "/start") {
            await bot.sendMessage(chatId, "Sammi platformasidagi kurslar",
                {reply_markup:
                        {keyboard:
                                [
                                    [
                                        {text: 'kurslarni ko\'rish',
                                            web_app: {
                                                url: 'https://telegram-web-bot-iota.vercel.app'
                                            }
                                        }
                                    ],
                                    [
                                        {text: '/help', value: 'kurslarni ko\'rish'}
                                    ]
                                ],
                            resize_keyboard: true,
                        }
                }
            )
        }
        if (text === "/help") {
            await bot.sendMessage(
                chatId, 'Platformadan kurslar sotib oling',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: "Kurlarni ko'rish", web_app: {url: "https://telegram-web-bot-iota.vercel.app"}}
                            ]
                        ]
                    }
                }
            )
        }
        if (msg.web_app_data?.data){
            try{
                const  data = JSON.parse(msg.web_app_data?.data);
                await bot.sendMessage( chatId,"sotib olgan kurslar ro'yxati :");
                for (item of data){
                    await bot.sendMessage(
                        chatId,
                        `${item.title} - ${item.quantity}x`
                    )
                }
                await bot.sendMessage(
                    chatId,
                    `Umumiy narx - ${data.reduce((a, c) => a + c.price * c.quantity, 0)
                        .toLocaleString("en-US", {
                            style: 'currency',
                            currency: "USD"
                        })
                    }`
                )
            }catch (error){
                console.log(error)
            }
        }
    });
};

bootstrap()

app.post("/web-data", async (request, response) => {
    const {queryID, products} = request.body;
    try{
        await bot.answerWebAppQuery(queryID, {

            id: queryID,
            title: "muvaffaqiyatli sotib oldingiz",
            input_message_content: {
                message_text: `Xaridingiz bilan tabriklayman. Siz${products.reduce((a, c) => a + c.price * c.quantity, 0)
                        .toLocaleString("en-US", {
                            style: 'currency',
                            currency: "USD"
                        })
                    } qiymatga ega mahsulot sotib oldingiz`
            }
        })
        return response.status(200).json({})
    }catch (error){
        return response.status(500).json({})
    }
})
app.listen(process.env.PORT || 8000, () =>
    console.log("server started")
)
