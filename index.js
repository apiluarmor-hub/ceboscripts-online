const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let onlineCount = 0;
const activeUsers = new Map(); // Para mejor control

app.get('/online', (req, res) => {
    res.json({ count: Math.max(1, onlineCount) });
});

app.post('/ping', (req, res) => {
    const userId = req.ip || "unknown"; // Simple identificación
    const now = Date.now();

    activeUsers.set(userId, now);
    onlineCount = activeUsers.size;

    // Limpiar usuarios inactivos cada 25 segundos
    setTimeout(() => {
        if (activeUsers.has(userId)) {
            activeUsers.delete(userId);
            onlineCount = activeUsers.size;
        }
    }, 25000);

    res.json({ success: true, count: onlineCount });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Online counter running on port ${PORT}`);
});
