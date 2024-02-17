"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const analytics_1 = require("firebase/analytics");
const firebase_config_json_1 = __importDefault(require("../firebase-config.json"));
async function init() {
    const app = (0, app_1.initializeApp)(firebase_config_json_1.default);
    console.log("Firebase initialized");
    const db = (0, firestore_1.getFirestore)(app);
    console.log("Firebase firestore initialized");
    if (await (0, analytics_1.isSupported)()) {
        const analytics = (0, analytics_1.getAnalytics)(app);
        console.log("Firebase analytics initialized");
        return { app, db, analytics };
    }
    return { app, db, analytics: null };
}
exports.default = init;
