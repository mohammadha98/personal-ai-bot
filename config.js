"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.SERPAPI_API_KEY = exports.OPENAI_API_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
_a = process.env, exports.OPENAI_API_KEY = _a.OPENAI_API_KEY, exports.SERPAPI_API_KEY = _a.SERPAPI_API_KEY, exports.PORT = _a.PORT;
