const chalk = require('chalk');
let users = new Array();
const config = require('./config.js');
const readline = require('readline');

module.exports.run = async (server) => {
    const io = require('socket.io')(server);

    io.on('connect', (socket) => {
        if(!socket.handshake.query.username) return socket.disconnect();
      
        io.emit('user-joined', socket.handshake.query.username);
        console.log(`${chalk.green("[+]")} ${socket.handshake.query.username}`);

        socket.on('message', message => {
            if(!message.content) return emitSocketError(socket, "Message content can't be empty!");
            if(!message.author) return emitSocketError(socket, "Message author can't be empty!");

            if(users.includes(message.author)) return emitSocketError(socket, `User '${message.author}' is already in the room, please change your username.`);

            if(message.system_user_pass) {
                if(message.system_user_pass !== config.system_user_password) return;
                message.system = true;
            }

            console.log(`${chalk.bold.hex(chalk.white)(message.author)}: ${message.content}`)
            io.emit("message", message);
        })

        socket.on('disconnect', () => {
            io.emit('user-left', socket.handshake.query.username);
            console.log(`${chalk.red("[-]")} ${socket.handshake.query.username}`);
        })
    })

    function emitSocketError(socket, message) {
        socket.emit("error", message);
        socket.close();
    }

}