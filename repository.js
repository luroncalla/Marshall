const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  "12068422882-burppdhqkugmiklvuifav5smdg7dik36.apps.googleusercontent.com",
  "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",
  "urn:ietf:wg:oauth:2.0:oob"
);


oAuth2Client.setCredentials({
  access_token:
    "ya29.a0ARrdaM-z26ppkgRgR8AMUVtcrBFJqnSS9a2Y-dDtGU-5tO53zTgWXVlT9lkIRGifjhJC-Aa2QaVCVl70xfxUXTdD3YKw0LA0c-X27eE56ntRLY82KcTRQxxgxPXpX29RvZ2499x0-jCUmxiwBQaum_ROvTes",
  refresh_token:
    "1//0hrc3qVlp0Uw3CgYIARAAGBESNwF-L9Ira3FelVUGrCeEbwHRLjilZW4pHWrj4u2Y_SYKfdwPDgbRa6RuYN7ckUPbCW6iiPXEcCM",
  scope: "https://www.googleapis.com/auth/spreadsheets",
  token_type: "Bearer",
  expiry_date: 1638823720529,
});

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });


async function read() {

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1OmLaUyQmLpsXzyiVnn5JY1jLMQxPHFfiEpdyCzok0x0',
    range: 'Productos!A2:E',
  });

  const rows = response.data.values;
  const products = rows.map((row) => ({
    id: +row[0],
    name: row[1],
    price: +row[2],
    image: row[3],
    stock: +row[4],
  }));

  return products;
}


async function write(products) {

  let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1OmLaUyQmLpsXzyiVnn5JY1jLMQxPHFfiEpdyCzok0x0",
    range: "Productos!A2:E",
    valueInputOption: "RAW",
    resource,
  });

  console.log(result.updateCells);
}
// async function readAndWrite(){
//     const products = await read();
//     products[0].stock = 20;
//     await write(products);
// }
// readAndWrite();

module.exports = {
  read,
  write,
};