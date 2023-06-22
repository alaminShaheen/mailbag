import express, { NextFunction, Request, Response } from "express";
import path from "path";
// import { serverInfo } from "./ServerInfo";
import * as IMAP from "imap";
// import * as SMTP from "./SMTP";
// import * as Contacts from "./Contacts";
// import { IContact } from "./Contacts";

// Instantiate express app
const app = express();

// This middleware takes care of parsing incoming request bodies that contain JSON to plain JavaScript objects,
app.use(express.json());

// Serve static content present in the dist of client directory when request route matches '/'.
// path.join joins the paths provided as arguments
// express.static serves the static content from the path provided as argument
app.use("/", express.static(path.join(__dirname, "../../client/dist")));


// CORS is a security mechanism built into web browsers that ensures that only certain domains can call your REST services.
// CORS protects your server by allowing only clients of a specific domain and not anybody from the world to call your servers.
// CORS forces you to specify the domains & methods that you’ll accept calls from for your API server.
// The browser will interrogate the server before making a request to get these headers, and the values
// determine what the browser will or won’t be allowed to do.
app.use((request: Request, response: Response, next: NextFunction) => {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
	response.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
	next();
});

// GET, DELETE emails

app.get("/mailboxes", async (inRequest: Request, inResponse: Response) => {
	try {
		const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
		
		const mailboxes: IMAP.IMailbox[] = await
			imapWorker.listMailboxes();
		inResponse.json(mailboxes);
	} catch (inError) {
		inResponse.send("error");
	}
});

app.get("/mailboxes/:mailbox", async (inRequest: Request, inResponse: Response) => {
	try {
		const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
		const messages: IMAP.IMessage[] = await imapWorker.listMessages({
			mailbox: inRequest.params.mailbox,
		});
		inResponse.json(messages);
	} catch (inError) {
		inResponse.send("error");
	}
});

app.get("/messages/:mailbox/:id", async (inRequest: Request, inResponse: Response) => {
	try {
		const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
		const messageBody: string | undefined = await imapWorker.getMessageBody({
			mailbox: inRequest.params.mailbox,
			id: parseInt(inRequest.params.id, 10),
		});
		inResponse.send(messageBody);
	} catch (inError) {
		inResponse.send("error");
	}
});

app.delete("/messages/:mailbox/:id", async (inRequest: Request, inResponse: Response) => {
	try {
		const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
		await imapWorker.deleteMessage({
			mailbox: inRequest.params.mailbox,
			id: parseInt(inRequest.params.id, 10),
		});
		inResponse.send("ok");
	} catch (inError) {
		inResponse.send("error");
	}
});


// Send Emails

app.post("/messages", async (inRequest: Request, inResponse: Response) => {
	try {
		const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
		await smtpWorker.sendMessage(inRequest.body);
		inResponse.send("ok");
	} catch (inError) {
		inResponse.send("error");
	}
});


// Contacts

app.get("/contacts", async (inRequest: Request, inResponse: Response) => {
	try {
		const contactsWorker: Contacts.Worker = new Contacts.Worker();
		const contacts: IContact[] = await contactsWorker.listContacts();
		inResponse.json(contacts);
	} catch (inError) {
		inResponse.send("error");
	}
});

app.post("/contacts", async (inRequest: Request, inResponse: Response) => {
	try {
		const contactsWorker: Contacts.Worker = new Contacts.Worker();
		
		const contact: IContact = await contactsWorker.addContact(inRequest.body);
		inResponse.json(contact);
	} catch (inError) {
		inResponse.send("error");
	}
});

app.delete("/contacts/:id", async (inRequest: Request, inResponse: Response) => {
	try {
		const contactsWorker: Contacts.Worker = new Contacts.Worker();
		await contactsWorker.deleteContact(inRequest.params.id);
		inResponse.send("ok");
	} catch (inError) {
		inResponse.send("error");
	}
});
