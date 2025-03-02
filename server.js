const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const users = [
    { id: 'user1', name: 'Alice' },
    { id: 'user2', name: 'Bob' },
    { id: 'user3', name: 'Charlie' }
];

const clients = new Map();

function broadcast(message, sender) {
    [...clients.keys()].forEach((client) => {
        if (client !== sender) {
            client.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', (ws) => {
    const user = users[clients.size]; // Assign a user based on connection order
    if (!user) {
        ws.close();
        return;
    }

    clients.set(ws, user);
    console.log(`${user.name} connected`);

    // Send initial user data
    ws.send(JSON.stringify({ type: 'init', user }));

    // Send updated user list to all clients
    const userList = Array.from(clients.values()).map(u => ({ id: u.id, name: u.name }));
    broadcast({ type: 'users', users: userList }, ws);

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const sender = clients.get(ws);

        console.log(`Received message from ${sender.name}:`, message);

        if (message.type === 'chat') {
            const fullMessage = {
                type: 'chat',
                senderId: sender.id,
                senderName: sender.name,
                content: message.content,
                timestamp: new Date().toISOString()
            };
            broadcast(fullMessage, ws);
        }
    });

    ws.on('close', () => {
        const user = clients.get(ws);
        clients.delete(ws);
        console.log(`${user.name} disconnected`);

        // Send updated user list to all clients
        const userList = Array.from(clients.values()).map(u => ({ id: u.id, name: u.name }));
        broadcast({ type: 'users', users: userList });
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on http://localhost:${PORT}`);
});

// Simulate messages between users
setTimeout(() => {
    const simulateMessage = (from, to, content) => {
        const message = {
            type: 'chat',
            senderId: from.id,
            senderName: from.name,
            content: content,
            timestamp: new Date().toISOString()
        };
        console.log(`Simulated message from ${from.name} to ${to.name}:`, message);
        broadcast(message);
    };

    simulateMessage(users[0], users[1], "Hey Bob, how are you?");
    setTimeout(() => simulateMessage(users[1], users[0], "Hi Alice! I'm good, thanks. How about you?"), 2000);
    setTimeout(() => simulateMessage(users[2], users[0], "Hello Alice and Bob! Mind if I join the conversation?"), 4000);
}, 5000);