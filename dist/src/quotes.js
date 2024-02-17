"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomQuote = void 0;
const quotes_json_1 = __importDefault(require("../configs/quotes.json"));
function getRandomQuote() {
    return quotes_json_1.default[Math.floor(Math.random() * quotes_json_1.default.length)];
}
exports.getRandomQuote = getRandomQuote;
