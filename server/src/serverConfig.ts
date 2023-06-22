import path from "path";
import fs from "fs";

const serverInfoFilePath = path.join(__dirname, "../serverInfo.json");
const rawServerInfo = fs.readFileSync(serverInfoFilePath, "utf-8");
const parsedServerInfo = JSON.parse(rawServerInfo);
