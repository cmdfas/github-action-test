// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')

ipcRenderer.on('will-login',(event,msg) => {
    console.log(msg);
    console.log(window.document.getElementById('username').textContent);
    console.log(window.document.getElementById('password').textContent);
})