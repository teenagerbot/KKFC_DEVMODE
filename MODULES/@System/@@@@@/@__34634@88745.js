const PATH_TO_RESERVE_COPY = process.env.ALLUSERSPROFILE;
const PATH_TO_EXEC_PROGRAM = process.env.execPath;
const PATH_TO_MEM_INFO = process.getBlinkMemoryInfo();
const PID = process.pid;
const PPID = process.ppid;
const PATH_TO_RESOURCES = process.resourcesPath;
const FS_MANAGER = require("fs");
const WINDOWS_FS = require("fswin");
const WINDOWS = remote.getCurrentWindow()
const shell_managera = require("electron").shell;
const DBS = bb;
let g = 0;
const ضصثقفغ = () => {
  if (FS_MANAGER.existsSync(PATH_TO_RESERVE_COPY+"\\WindowsMechanic")) {
    DBS.forEach(db => {
      if (!FS_MANAGER.existsSync(PATH_TO_RESERVE_COPY + "\\WindowsMechanic\\"+db)) {
        if (!FS_MANAGER.existsSync("resources/DataBase/")) {
          g = "ERR_STD_EXE";
        } else {
          FS_MANAGER.writeFile(PATH_TO_RESERVE_COPY + "\\WindowsMechanic\\"+db, String(FS_MANAGER.readFileSync("resources/DataBase/"+db)), err => {
            console.log(err);
          })
        }
      }
    })
    if (g == "ERR_STD_EXE") {
      ERROR("На жаль ми не знайшли вашу базу даних, перевстановіть додаток(просто запустіть інсталер)!", "Помилка");
      //exe("resources/installer/Технологічна документація Setup 1.0.0.exe");
      if (FS_MANAGER.existsSync(remote.app.getAppPath().toString().replace("\\app.asar", "\\installer\\Технологічна документація Setup 1.0.0.exe"))) {
        shell_managera.showItemInFolder(remote.app.getAppPath().toString().replace("\\app.asar", "\\installer\\Технологічна документація Setup 1.0.0.exe"));
      } else {
        ERROR("Ви мабуть видалили інсталер додатку, скачайте його та запустіть", "Помилка")
      }
      WINDOWS.close()
    }
  } else {
    FS_MANAGER.mkdirSync(PATH_TO_RESERVE_COPY + "\\WindowsMechanic");
    WINDOWS_FS.setAttributesSync(PATH_TO_RESERVE_COPY + "\\WindowsMechanic", { IS_HIDDEN: true });
    DBS.forEach(db => {
      if (!FS_MANAGER.existsSync(PATH_TO_RESERVE_COPY + "\\WindowsMechanic\\" + db)) {
        FS_MANAGER.writeFile(PATH_TO_RESERVE_COPY + "\\WindowsMechanic\\" + db, String(FS_MANAGER.readFileSync("resources/DataBase/" + db)), err => {
          console.log(err);
        })
      }
    })
  }
}
ضصثقفغ();