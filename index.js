const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')
const token = '5620508368:AAEqHMVLadLrWQlO2kRo1EtCT8uUinfUw5c'

const bot = new TelegramBot(token, {polling: true});
app.use(express.json());
app.use(cors())
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
                                ]
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
                    `Umumiy narx - ${
                        data.reduce((a, c) => a + c.price * c.quantity, 0)
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