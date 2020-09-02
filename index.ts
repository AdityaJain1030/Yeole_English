import * as Discord from 'discord.js'
import * as cleverbot from 'cleverbot-free' 
import * as puppeteer from 'puppeteer'

import {config} from 'dotenv'
const secrets = config()
const client = new Discord.Client()
client.login(process.env.TOKEN)
let browser, _page: puppeteer.Browser | puppeteer.Page

function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

const endBrowser = async (_browser: { close: () => any }) => {
    await _browser.close();
}
const startBrowser = async() => {
    const b = await puppeteer.launch( {args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]})
    const e2s = await b.newPage()
    await e2s.goto('https://lingojam.com/ShakespeareanEnglishtoModernEnglish')
    return [b, e2s]
}
const translate = async(page: { $: (arg0: string) => any }, text: string) => {
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
    if(msg.content.startsWith((process.env.PREFIX as string)) && msg.author.bot===false){
        msg.channel.startTyping()
        const x = await cleverbot(msg.content.slice(1, msg.content.length))
        const old = await translate(_page, x)
        msg.channel.send(`\`${old}\``)
    }
})
