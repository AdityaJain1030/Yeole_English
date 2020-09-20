import * as Discord from 'discord.js'
import cleverbot from 'cleverbot-free' 
import puppeteer from 'puppeteer'

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
    await e2s.goto('https://lingojam.com/EnglishtoShakespearean')
    return [b, e2s]
}
const translate = async(page: { $: (arg0: string) => any }, text: string) => {
    const input = await page.$('textarea[id=english-text]');
    await input.click({ clickCount: 3 })
    await input.type(text);
    sleep(1000)
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
        const last = msg.channel.lastMessage?.author.bot
        if(msg.content.slice(1, 10).toLowerCase() === "translate"){
            const text = msg.content.slice(10, msg.content.length)
            const x = await translate(_page, text)
            msg.channel.send(x)
        }
        else if (!last){
            // msg.channel.startTyping()
            const x = await cleverbot(msg.content.slice(1, msg.content.length))
            const old = await translate(_page, x)
            msg.channel.send(`\`${old}\``)
        }
    }
})
client.on('guildMemberAdd', async(member)=>{
    if(!member.user?.bot){
        const role = member.guild.roles.cache.find(role => role.name === 'person')
        try{
            member.roles.add(role || '')
        }
        catch(err){
            member.user?.send('Could Not Give Role. DM @DebigPotato6414 for more information')
        }
    }
})