const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
const SECRET_KEY = process.env.SECRET_KEY || "default-secret";
console.log("Secret chargé :", SECRET_KEY);

io.on('connection', socket => {
    console.log('Utilisateur connecté');

    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});