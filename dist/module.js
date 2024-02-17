"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpWithEmail = exports.signInWithEmail = exports.init = void 0;
const init_1 = __importDefault(require("./src/init"));
exports.init = init_1.default;
const auth_1 = require("./src/auth");
Object.defineProperty(exports, "signInWithEmail", { enumerable: true, get: function () { return auth_1.signInWithEmail; } });
Object.defineProperty(exports, "signUpWithEmail", { enumerable: true, get: function () { return auth_1.signUpWithEmail; } });
