"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const config_1 = require("./config");
const personal_bot_1 = require("./personal-bot");
const port = config_1.PORT || 3002;
// Body parsing middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://mohammadhashemi.info");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use((0, cors_1.default)());
// Routes
app.get("/", (req, res) => {
    res.json({ message: "hello from Hoshyad Server Side..." });
});

app.post("/api/personal-bot", async (req, res) => {
    const isFirst = JSON.parse(req.body.isFirst);
    const message = req.body.message;
    const response = await (0, personal_bot_1.personalChatChain)(message, isFirst);
    return res.status(200).json({ response });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
