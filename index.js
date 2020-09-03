"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Discord = require("discord.js");
var cleverbot = require("cleverbot-free");
var puppeteer = require("puppeteer");
var dotenv_1 = require("dotenv");
var secrets = dotenv_1.config();
var client = new Discord.Client();
client.login(process.env.TOKEN);
var browser, _page;
function sleep(milliseconds) {
    var date = Date.now();
    var currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
var endBrowser = function (_browser) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _browser.close()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var startBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var b, e2s;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({ args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                    ] })];
            case 1:
                b = _a.sent();
                return [4 /*yield*/, b.newPage()];
            case 2:
                e2s = _a.sent();
                return [4 /*yield*/, e2s.goto('https://lingojam.com/ShakespeareanEnglishtoModernEnglish')];
            case 3:
                _a.sent();
                return [2 /*return*/, [b, e2s]];
        }
    });
}); };
var translate = function (page, text) { return __awaiter(void 0, void 0, void 0, function () {
    var input, e, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.$('textarea[id=english-text]')];
            case 1:
                input = _a.sent();
                return [4 /*yield*/, input.click({ clickCount: 3 })];
            case 2:
                _a.sent();
                return [4 /*yield*/, input.type(text)];
            case 3:
                _a.sent();
                sleep(400);
                return [4 /*yield*/, page.$('textarea[id=ghetto-text]')];
            case 4:
                e = _a.sent();
                return [4 /*yield*/, e.getProperty('value')];
            case 5: return [4 /*yield*/, (_a.sent()).jsonValue()];
            case 6:
                r = _a.sent();
                return [2 /*return*/, r];
        }
    });
}); };
client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, startBrowser()];
            case 1:
                x = _a.sent();
                browser = x[0];
                _page = x[1];
                console.log('ready');
                return [2 /*return*/];
        }
    });
}); });
client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var last, x, old;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(msg.content.startsWith(process.env.PREFIX) && msg.author.bot === false)) return [3 /*break*/, 3];
                last = (_a = msg.channel.lastMessage) === null || _a === void 0 ? void 0 : _a.author.bot;
                if (msg.content.slice(1, 9).toLowerCase() === "translate") {
                    msg.channel.send('no');
                }
                if (!!last) return [3 /*break*/, 3];
                return [4 /*yield*/, cleverbot(msg.content.slice(1, msg.content.length))];
            case 1:
                x = _b.sent();
                return [4 /*yield*/, translate(_page, x)];
            case 2:
                old = _b.sent();
                msg.channel.send("`" + old + "`");
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
