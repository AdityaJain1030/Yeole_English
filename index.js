"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const cleverbot_free_1 = __importDefault(require("cleverbot-free"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const dotenv_1 = require("dotenv");
const secrets = dotenv_1.config({ path: "./data/.env" }).parsed;
const client = new Discord.Client();
client.login(secrets.TOKEN);
let browser, _page;
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
const endBrowser = (_browser) => __awaiter(void 0, void 0, void 0, function* () {
    yield _browser.close();
});
const startBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    const b = yield puppeteer_1.default.launch();
    const e2s = yield b.newPage();
    yield e2s.goto('https://lingojam.com/ShakespeareanEnglishtoModernEnglish');
    return [b, e2s];
});
const translate = (page, text) => __awaiter(void 0, void 0, void 0, function* () {
    const input = yield page.$('textarea[id=english-text]');
    yield input.click({ clickCount: 3 });
    yield input.type(text);
    sleep(400);
    const e = yield page.$('textarea[id=ghetto-text]');
    const r = yield (yield e.getProperty('value')).jsonValue();
    return r;
});
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    let x = yield startBrowser();
    browser = x[0];
    _page = x[1];
    console.log('ready');
}));
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.content.startsWith(secrets.PREFIX) && msg.author.bot === false) {
        msg.channel.startTyping();
        const x = yield cleverbot_free_1.default(msg.content.slice(1, msg.content.length));
        const old = yield translate(_page, x);
        msg.channel.send(`\`${old}\``);
        msg.channel.stopTyping();
    }
}));
