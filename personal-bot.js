"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalChatChain = void 0;
const openai_1 = require("langchain/chat_models/openai");
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
const openai_2 = require("langchain/embeddings/openai");
const chains_1 = require("langchain/chains");
const text_1 = require("langchain/document_loaders/fs/text");
const schema_1 = require("langchain/schema");
const translatte = require("translatte");
let chain;
let chatHistory = [];
let vectorStore;
// const apiKey="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";
const apiKey = config_1.OPENAI_API_KEY;
const filePath = path_1.default.join(__dirname, "public", "biography.txt");

// Create docs with a loader
const loader = new text_1.TextLoader(filePath);
(async () => {
  const docs = await loader.load();
  vectorStore = await hnswlib_1.HNSWLib.fromDocuments(
    docs,
    new openai_2.OpenAIEmbeddings({ openAIApiKey: apiKey })
  );
})();
const initializeChain = async (initialPrompt) => {
  const model = new openai_1.ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey,
  });


 

  chain = chains_1.ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      verbose: false,
      returnSourceDocuments: false,
      qaChainOptions: {
        type: "refine", // Customize the QA chain type
        maxDocuments: 5, // Set the maximum number of documents to consider for answering the question
        maxAnswerLength: 100, // Set the maximum length of the answer
        maxPassages: 3, // Set the maximum number of passages to consider for answering the question
        maxPassageLength: 50, // Set the maximum length of each passage
      },
    }
  );
  const response = await chain.call({
    question: initialPrompt,
    chat_history: chatHistory,
  });
  chatHistory.push(new schema_1.ChatMessage(response.text, "bot"));

  return response;
};
async function personalChatChain(prompt, isFirst) {
  if (isFirst) {
    try {
      const initialPrompt = `
      <begin>I want you to play the role of Mohammad Hashemi.
      I will ask you questions about yourself and you will answer very briefly based on document and like a human being with feelings and a little humor.
      dont answer questions which is not about Mohammad Hashemi
       Be sure to give me your answers in Farsi and do not use English as much as possible because my English is weak.
        This is first conversation with Mohammad Hashemi:<end>



            ${prompt}`;
      chatHistory.push(new schema_1.ChatMessage(initialPrompt, "user"));
      const response = await initializeChain(initialPrompt);

      return response;
    } catch (error) {
      console.log(error);
    }
  } else {
    // chatHistory.push({
    //     role:"user",
    //     content:prompt
    // });
    const enginePrompt = prompt;
    chatHistory.push(new schema_1.ChatMessage(enginePrompt, "user"));
    const response = await chain.call({
      question: enginePrompt,
      chat_history: chatHistory,
    });
    // chatHistory.push({
    //     role:"bot",
    //     content:response.text
    // });
    chatHistory.push(new schema_1.ChatMessage(response.text, "bot"));

    // const persianResponse =await translatte(response.text,{from:"en",to:'fa'});
    return response;
  }
}
exports.personalChatChain = personalChatChain;
