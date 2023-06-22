"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// import { serverInfo } from "./ServerInfo";
const IMAP = __importStar(require("imap"));
// import * as SMTP from "./SMTP";
// import * as Contacts from "./Contacts";
// import { IContact } from "./Contacts";
// Instantiate express app
const app = (0, express_1.default)();
// This middleware takes care of parsing incoming request bodies that contain JSON to plain JavaScript objects,
app.use(express_1.default.json());
// Serve static content present in the dist of client directory when request route matches '/'.
// path.join joins the paths provided as arguments
// express.static serves the static content from the path provided as argument
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
// CORS is a security mechanism built into web browsers that ensures that only certain domains can call your REST services.
// CORS protects your server by allowing only clients of a specific domain and not anybody from the world to call your servers.
// CORS forces you to specify the domains & methods that you’ll accept calls from for your API server.
// The browser will interrogate the server before making a request to get these headers, and the values
// determine what the browser will or won’t be allowed to do.
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    response.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    next();
});
// GET, DELETE emails
app.get("/mailboxes", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const mailboxes = yield imapWorker.listMailboxes();
        inResponse.json(mailboxes);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
app.get("/mailboxes/:mailbox", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messages = yield imapWorker.listMessages({
            mailbox: inRequest.params.mailbox,
        });
        inResponse.json(messages);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
app.get("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messageBody = yield imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10),
        });
        inResponse.send(messageBody);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
app.delete("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10),
        });
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// Send Emails
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(serverInfo);
        yield smtpWorker.sendMessage(inRequest.body);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// Contacts
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contacts = yield contactsWorker.listContacts();
        inResponse.json(contacts);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
//# sourceMappingURL=main.js.map