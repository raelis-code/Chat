

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

app.use(express.static('public'));
const keyVaultUrl = "https://chatapp-keyvaul.vault.azure.net/";

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

async function getSecret() {
    const secret = await client.getSecret("secret-key");
    return secret.value;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

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

let SECRET_KEY;

(async () => {
    try {
        SECRET_KEY = await getSecret();
        console.log("Secret récupéré depuis Key Vault :", SECRET_KEY);
    } catch (error) {
        console.log("Azure indisponible, fallback local");
        SECRET_KEY = "local-secret"; 
    }
})();

http.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});