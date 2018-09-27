const fs = require('fs').promises;
const { google } = require('googleapis');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

const getOverview = async () => {
  let overviewData = null;

  try {
    const credentialsFile = await fs.readFile('config/credentials.json');
    const authorizationToken = await authorize(JSON.parse(credentialsFile));
    overviewData = await getOverviewData(authorizationToken);
  } catch(error) {
    console.log(`**Error loading client secret file**\n${error}`);
  }

  return overviewData;
};

const authorize = async (credentials) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  let authorizationToken = null;

  try {
    authorizationToken = await fs.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(authorizationToken));
  } catch(error) {
    authorizationToken = await getNewToken(oAuth2Client);
  }

  return oAuth2Client;
}

const getNewToken = oAuth2Client => (
  new Promise((resolve) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        resolve(oAuth2Client);
      });
    });
  })
);

const transformMember = dataRow => {
  if (dataRow && dataRow[0] && dataRow[1]) {
    return {
      firstName: dataRow[1],
      lastName: dataRow[0],
      totalPoints: dataRow[3],
    }
  }

  return null;
};

const getOverviewData = (auth) => (
  new Promise((resolve) => {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1QNooiNPba49hX_8jCBLR3WtUmIMC4UOipaf-ej7qSYE',
      range: 'Current Members!A1:BG',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      const members = [];

      if (rows.length) {
        rows.map((row) => {
          const transformedMember = transformMember(row);

          if (transformedMember) {
            members.push(transformMember(row));
          }
        });
      } else {
        console.log('No data found.');
      }

      resolve(members);
    });
  })
);

module.exports.getOverview = getOverview;
