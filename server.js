const express = require('express'); const app = express();
const http = require('http').createServer(app); const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', socket => { console.log('A user connected');

socket.on('chat message', msg => { io.emit('chat message', msg);
});

socket.on('disconnect', () => { console.log('A user disconnected');
});
});

const PORT = 3000; http.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});