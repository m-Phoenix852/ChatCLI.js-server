const chalk = require('chalk');
let users = new Array();
const config = require('./config.js');
const readline = require('readline');
const { type } = require('os');

module.exports.run = async (server) => {
    const io = require('socket.io')(server);

    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      input.on("line", async (message) => {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        if(message === '' || message === null || typeof message === 'undefined') return;

        io.emit('message', {
            author: "System",
            content: message,
            system: true
        });
        console.log(`${chalk.yellow('System:')} ${message}`)
      });

    io.on('connect', (socket) => {
        if(!socket.handshake.query.username) return emitSocketError(socket, 'Username can\'t be blank!');

        if(!socket.handshake.query.auth) return emitSocketError(socket, 'Auth can\'t be blank!');

        if(socket.handshake.query.auth !== config.password) return emitSocketError(socket, 'Authorization token is incorrect!');
      
        io.emit('user-joined', socket.handshake.query.username);
        console.log(`${chalk.green("[+]")} ${socket.handshake.query.username}`);

        socket.on('message', message => {
            if(!message.content) return emitSocketError(socket, "Message content can't be blank!");
            if(!message.author) return emitSocketError(socket, "Message author can't be blank!");

            if(users.includes(message.author)) return emitSocketError(socket, `User '${message.author}' is already in the room, please change your username.`);

            console.log(`${chalk.bold.hex(chalk.white)(message.author)}: ${message.content}`)
            io.emit("message", message);
        })

        socket.on('disconnect', () => {
            io.emit('user-left', socket.handshake.query.username);
            console.log(`${chalk.red("[-]")} ${socket.handshake.query.username}`);
        })
    })

    function emitSocketError(socket, message) {
        socket.emit("clientError", message);
        socket.disconnect();
    }

}