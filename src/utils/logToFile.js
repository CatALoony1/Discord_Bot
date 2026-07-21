const fs = require('fs');
const path = require('path');
require('dotenv').config();

const install_hook_to = function (obj) {
  if (obj.hook || obj.unhook) {
    throw new Error('Object already has properties hook and/or unhook');
  }

  obj.hook = function (_meth_name, _fn, _is_async) {
    let self = this,
      meth_ref;

    if (
      Object.prototype.toString.call(self[_meth_name]) !== '[object Function]'
    ) {
      throw new Error('Invalid method: ' + _meth_name);
    }

    if (self.unhook.methods[_meth_name]) {
      throw new Error('Method already hooked: ' + _meth_name);
    }

    meth_ref = self.unhook.methods[_meth_name] = self[_meth_name];

    self[_meth_name] = function () {
      const args = Array.prototype.slice.call(arguments);

      while (args.length < meth_ref.length) {
        args.push(undefined);
      }

      args.push(function () {
        const args = arguments;

        if (_is_async) {
          process.nextTick(function () {
            meth_ref.apply(self, args);
          });
        } else {
          meth_ref.apply(self, args);
        }
      });

      _fn.apply(self, args);
    };
  };

  obj.unhook = function (_meth_name) {
    let self = this,
      ref = self.unhook.methods[_meth_name];

    if (ref) {
      self[_meth_name] = self.unhook.methods[_meth_name];
      delete self.unhook.methods[_meth_name];
    } else {
      throw new Error('Method not hooked: ' + _meth_name);
    }
  };

  obj.unhook.methods = {};
};

async function sendAlert(targetChannel, messageText, logFilePath) {
  if (!targetChannel) return;

  try {
    const payload = { content: messageText };

    if (fs.existsSync(logFilePath)) {
      payload.files = [
        {
          attachment: logFilePath,
          name: 'bot._log',
        },
      ];
    }

    await targetChannel.send(payload);
  } catch (err) {
    process.stderr.write(
      `Fehler beim Senden der Discord-Alert-Nachricht: ${err.message}\n`,
    );
  }
}

module.exports = {
  run: async (client) => {
    let targetChannel = null;
    try {
      if (process.env.LOG_ID) {
        targetChannel = await client.channels.fetch(process.env.LOG_ID);
      }
    } catch (e) {
      console.error('Konnte LOG_ID Channel nicht laden:', e.message);
    }

    const logFilePath = path.join(__dirname, '../../logs/bot._log');
    const chatFilePath = path.join(__dirname, '../../logs/chat._log');

    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const handleLogWrite = async function (string, isErrorStream = false) {
      let d = new Date();
      const timestamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')},${d.getMilliseconds()}`;

      const formattedString = `${timestamp}|${string}`;

      if (formattedString.includes('TESTJG')) {
        fs.appendFile(
          chatFilePath,
          formattedString.replace('TESTJG', ''),
          (err) => {
            if (err) process.stderr.write(`ChatLog Error: ${err}\n`);
          },
        );
      } else {
        fs.appendFile(logFilePath, formattedString, (err) => {
          if (err) process.stderr.write(`BotLog Error: ${err}\n`);
        });

        if (formattedString.includes('connect ECONNREFUSED')) {
          await sendAlert(
            targetChannel,
            `🚨 **DB Connection ERROR** <@${process.env.ADMIN_ID}> please check DB`,
            logFilePath,
          );
        } else if (
          isErrorStream ||
          formattedString.toLowerCase().includes('error') ||
          formattedString.toLowerCase().includes('fatal')
        ) {
          await sendAlert(
            targetChannel,
            `⚠️ **ERROR DETECTED** <@${process.env.ADMIN_ID}> please check log`,
            logFilePath,
          );
        }
      }
    };

    install_hook_to(process.stdout);
    process.stdout.hook(
      'write',
      async function (string) {
        await handleLogWrite(string, false);
      },
      true,
    );

    install_hook_to(process.stderr);
    process.stderr.hook(
      'write',
      async function (string) {
        await handleLogWrite(string, true);
      },
      true,
    );
  },
};
