import { IServerInfo } from "models/interfaces/IServerInfo";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";

export class Worker {
	private static serverInfo: IServerInfo;
	
	constructor (serverInfo: IServerInfo) {
		Worker.serverInfo = serverInfo;
	}
	
	sendMessage (inOptions: SendMailOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			const transport = nodemailer.createTransport(Worker.serverInfo.smtp);
			transport.sendMail(inOptions, (onError: Error | null, inInfo: SentMessageInfo) => {
					if (onError) {
						reject(onError);
					} else {
						resolve();
					}
				},
			);
		});
	}
}
