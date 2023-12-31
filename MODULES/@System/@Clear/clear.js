const rem = require("@electron/remote")
function clear(form) {
    if (localStorage.getItem(String(form))) {
        rem.dialog.showMessageBox({
            "type": "question",
            'title': 'Підтвердіть',
            'message': "Ви вводили якісь данні на цій формі, видалити їх?",
            'buttons': [
                'Видалити',
                'Не видаляти'
            ]
          }).then((result) => {
              if (result.response !== 0) { return; }
              if (result.response === 0) {
                localStorage.removeItem(String(form));
                location.reload()
              }
          })
    }
}
