const { BrowserWindow, shell } = require('electron');
const path = require('path');
const fswin = require('fswin');
const fs = require('fs');
let y;
const windows = remote.getCurrentWindow();
connectToRemoteServer('https://server.gooq.repl.co', (connection) => {
  if (connection.connection == true) {
    document.querySelector('img.stat').src = '../imgs/online.png';
    document.querySelector('img.stat').classList.remove('offline');
    document.querySelector('img.stat').classList.add('online');
    sessionStorage.removeItem('__Online');
    document.querySelector('#export').classList.remove('offline');
    connection.server.on('disconnect', () => {
      document.querySelector('img.stat').src = '../imgs/offline.png';
      document.querySelector('img.stat').classList.remove('online');
      document.querySelector('img.stat').classList.add('offline');
      if (navigator.onLine != true) {
        sessionStorage.setItem('__Online', 'WiFi');
        document.querySelector(
          'errorconnection code cd'
        ).innerHTML = `нема інтернету`;
      } else {
        sessionStorage.setItem('__Online', 'Server');
        document.querySelector(
          'errorconnection code cd'
        ).innerHTML = `розірвався зв'язок із сервером`;
      }
      document.querySelector('#export').classList.add('offline');
    });
    connection.server.on('connect', () => {
      document.querySelector('img.stat').src = '../imgs/online.png';
      document.querySelector('img.stat').classList.remove('offline');
      document.querySelector('img.stat').classList.add('online');
      sessionStorage.removeItem('__Online');
      document.querySelector('#export').classList.remove('offline');
    });
    connection.server.on('requestFile', () => {
      sendFile('resources/export/DB.zip', connection.server);
      document.querySelector('sd img').src = '../imgs/sending.gif';
      document.querySelector('sd').style.display = 'block';
    });
    connection.server.on('fileTransfered', () => {
      document.querySelector('sd').style.display = 'none';
      document.querySelector('sd img').src = '../imgs/sending.gif';
      SUCCESS('Файли успішно надіслані', 'Успішно');
      fswin.setAttributesSync('resources/export', { IS_HIDDEN: false });
    });
    connection.server.on('ZIP', (zip) => {
      if (!fs.existsSync('resources/import')) {
        fs.mkdirSync('resources/import');
        fswin.setAttributesSync('resources/import', { IS_HIDDEN: true });
        fs.writeFile(
          'resources/import/DB.zip',
          Buffer.from(zip.fileData),
          (err) => {
            if (err) {
              console.log(err);
            } else {
              connection.server.emit('fileTransfered');
              fswin.setAttributesSync('resources/import', { IS_HIDDEN: false });
              document.querySelector('sd').style.display = 'none';
              document.querySelector('sd img').src = '../imgs/sending.gif';
              setTimeout(() => {
                updater();
              }, 600);
            }
          }
        );
      } else {
        fswin.setAttributesSync('resources/import', { IS_HIDDEN: true });
        fs.writeFile(
          'resources/import/DB.zip',
          Buffer.from(zip.fileData),
          (err) => {
            if (err) {
              console.log(err);
            } else {
              connection.server.emit('fileTransfered');
              fswin.setAttributesSync('resources/import', { IS_HIDDEN: false });
              document.querySelector('sd').style.display = 'none';
              document.querySelector('sd img').src = '../imgs/sending.gif';
              setTimeout(() => {
                updater();
              }, 600);
            }
          }
        );
      }
    });
    connection.server.on('requestFileTransfer', () => {
      remote.dialog
        .showMessageBox(windows, {
          'type': 'question',
          'title': 'Увага',
          'message':
            "Хтось намагається надіслати файли на ваш комп'ютер, підтвердити?",
          'buttons': ['Так', 'Ні'],
        })
        .then((result) => {
          if (result.response === 0) {
            connection.server.emit('allowTransferFiles');
            document.querySelector('sd img').src = '../imgs/receive.gif';
            document.querySelector('sd').style.display = 'block';
          }
        })
        .catch((err) => {
          ERROR(err);
        });
    });
  }
  document.querySelector('#export').onclick = () => {
    if (!sessionStorage.getItem('__Online')) {
      exportDataBases(connection.server);
    }
  };
});
document.querySelectorAll('img').forEach((img) => {
  img.ondrag = (r) => {
    r.preventDefault();
  };
  img.ondragstart = (r) => {
    r.preventDefault();
  };
});
document.querySelector('#tables').onclick = () => {
  const table = new remote.BrowserWindow({
    width: 466,
    height: 741,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      devTools: true,
    },
    icon: path.join(__dirname, '../', 'icon.ico'),
  });
  table.maximize();
  remote.require('@electron/remote/main').enable(table.webContents);
  table.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  );
  table.loadFile('main/TABLE1.html');
};
document.querySelector('#forms').onclick = () => {
  const form1 = new remote.BrowserWindow({
    width: 466,
    height: 741,
    autoHideMenuBar: true,
    //transparent: true,
    frame: false,
    resizable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      devTools: true,
    },
    icon: path.join(__dirname, '../', 'icon.ico'),
  });
  remote.require('@electron/remote/main').enable(form1.webContents);
  form1.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  );
  form1.loadFile('main/form1.html');
};
function updater() {
  remote.dialog
    .showMessageBox(windows, {
      'type': 'question',
      'title': 'Розпакування',
      'message':
        'Архів з базою даних отриманий, розпакувати його(тоді всі таблиці та данні будуть замінені!)?',
      'buttons': ['Так, розпакувати', 'Ні, я самостійно розпакую'],
    })
    .then((result) => {
      if (result.response === 0) {
        updateDataBaseFromRemoteDesktop();
      } else {
        shell.showItemInFolder(
          remote.app
            .getAppPath()
            .toString()
            .replace('\\app.asar', '\\import\\DB.zip')
        );
      }
    })
    .catch((err) => {
      ERROR(err);
    });
}

document.querySelector('#coll').onclick = () => {
  windows.minimize();
};
document.querySelector('#min').onclick = function () {
  if (this.className == 'win') {
    windows.unmaximize();
    windows.setSize(1000, 650, false);
    this.className = 'unwin';
    this.src = '../imgs/uncollapse.png';
  } else {
    windows.maximize();
    this.className = 'win';
    this.src = '../imgs/minimize.png';
  }
};
document.querySelector('#clo').onclick = function () {
  windows.close();
};
var exec = require('child_process').exec;

exec('NET SESSION', function (err, so, se) {
  const Admin = se.length === 0 ? 'admin' : 'not admin';
  const Buttons = [
    {
      button: {
        text: 'Закрити',
        id: 'dely',
        click: () => {
          this.parentElement.parentElement.remove();
          document.querySelector('window_screen').style.cssText = '';
        },
      },
    },
  ];
  if (Admin != 'admin') {
    Buttons.push({
      button: {
        text: 'Видалити всі данні додатку',
        id: 'nodely',
        click: () => {
          this.parentElement.parentElement.remove();
          document.querySelector('window_screen').style.cssText = '';
        },
      },
    });
  }
  document.querySelector('.settings').onclick = () => {
    let Path = String(remote.app.getPath('exe'));
    const Folders = Path.split('\\');
    Dialog(
      /*html*/ `<h2>Опис програми</h2>
    <p>Версія програми: ${remote.app.getVersion()}</p>
    <p>Автор: <a href='https://t.me/html_NODE_PHP_developer' target='_blank'>Суручан Володимир</a></p>
    <p class='App' path='${remote.app.getAppPath()}'><quest>Де знаходиться програма</quest><answer>${Folders.map(
        (folder) => {
          const Folder = `
        <span
          class=${
            folder.endsWith(':')
              ? 'Disc'
              : !folder.endsWith('.exe')
              ? 'Folder'
              : 'Program'
          }>${folder}
        </span>`;
          return Folder;
        }
      ).join('<splitter>/</splitter>')}</answer></p>`,
      'Інформація',
      Buttons,
      false
    );
    document.querySelector('quest').onmouseover = function () {
      this.onmousemove = (ev) => {
        document.querySelector(
          'p.App answer'
        ).style.cssText = `display:block;top:${ev.clientY - 30}px;left:${
          ev.clientX - 212.5
        }px;`;
      };
    };
    document.querySelector('p.App quest').onmouseout = function () {
      document.querySelector('p.App answer').style.cssText = `display:none;`;
    };
  };
});
document.querySelector('#export').onmouseover = () => {
  document.querySelector('#export').onmousemove = (t) => {
    if (
      sessionStorage.getItem('__Online') == 'WiFi' ||
      sessionStorage.getItem('__Online') == 'Server'
    ) {
      document.querySelector(
        'errorconnection'
      ).style.cssText = `display: block;top: ${t.clientY}px;left: ${
        t.clientX - 150
      }px`;
    } else {
      document.querySelector(
        'errorconnection'
      ).style.cssText = `display: none;top: ${t.clientY}px;left: ${
        t.clientX - 150
      }px`;
    }
    if (sessionStorage.getItem('__Online') == 'WiFi') {
      document.querySelector(
        'errorconnection code cd'
      ).innerHTML = `нема інтернету`;
    } else {
      document.querySelector(
        'errorconnection code cd'
      ).innerHTML = `розірвався зв'язок із сервером`;
    }
  };
};
document.querySelector('#export').onmouseout = (t) => {
  document.querySelector(
    'errorconnection'
  ).style.cssText = `display: none;top: ${t.clientY}px;left: ${
    t.clientX - 150
  }px`;
};
//Cosmos DB SQL Studio
//MySQL
//SQLite Viewer
//Binary Viewer
//ERD Editor - cool
//SQLite3 Editor - cool
//SQL Snippets
//SQL Lit
//https://code.visualstudio.com/docs/languages/tsql
