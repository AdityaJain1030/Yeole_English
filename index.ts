import * as Discord from 'discord.js'
import cleverbot from 'cleverbot-free' 
import puppeteer from 'puppeteer'

import {config} from 'dotenv'
const secrets = config({path: "./data/.env"}).parsed
const client = new Discord.Client()
client.login(secrets.TOKEN)
let browser, _page

function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

const endBrowser = async (_browser) => {
    await _browser.close();
}
const startBrowser = async() => {
    const b = await puppeteer.launch()
    const e2s = await b.newPage()
    await e2s.goto('https://lingojam.com/ShakespeareanEnglishtoModernEnglish')
    return [b, e2s]
}
const translate = async(page, text: string) => {
    const input = await page.$('textarea[id=english-text]');
    await input.click({ clickCount: 3 })
    await input.type(text);
    sleep(400)
    const e = await page.$('textarea[id=ghetto-text]')
    const r = (await (await e.getProperty('value')).jsonValue() as string)
    return r
}
client.on('ready', async() => {
    let x = await startBrowser()
    browser = x[0]
    _page = x[1]
    console.log('ready')
})
client.on('message', async (msg) => {
    if(msg.content.startsWith(secrets.PREFIX) && msg.author.bot===false){
        msg.channel.startTyping()
        const x = await cleverbot(msg.content.slice(1, msg.content.length))
        const old = await translate(_page, x)
        msg.channel.send(`\`${old}\``)
        msg.channel.stopTyping()
    }
})
