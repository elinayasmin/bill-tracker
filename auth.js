const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");


const credentials = JSON.parse(fs.readFileSync("client.json"));
const { client_id, client_secret, redirect_uris } = credentials.web;


const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);


const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/spreadsheets"]
});

console.log("Authorize this app by visiting this URL:", authUrl);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the authorization code here: ", (code) => {
    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error("❌ Error retrieving access token:", err);
            return;
        }

        console.log("✅ Access Token:", token);
        oauth2Client.setCredentials(token);

     
        fs.writeFileSync("token.json", JSON.stringify(token));

        console.log("🔹 Token saved successfully.");
        rl.close();

        
        fetchSheetData();
    });
});


function fetchSheetData() {
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    sheets.spreadsheets.values.get({
        spreadsheetId: "1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4",
        range: "A1:B10"
    }, (err, res) => {
        if (err) {
            console.error("API Request Failed:", err);
            return;
        }
        console.log("Google Sheets Data:", res.data.values);
    });
}
