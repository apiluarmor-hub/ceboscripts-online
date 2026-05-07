const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mejor sistema de conteo
const activeUsers = new Map();

const CLEANUP_INTERVAL = 30000; // 30 segundos

// Limpieza automática cada 30 segundos
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, timestamp] of activeUsers.entries()) {
        if (now - timestamp > 45000) { // 45 segundos sin ping = desconectar
            activeUsers.delete(key);
            cleaned++;
        }
    }
    if (cleaned > 0) {
        console.log(`Limpieza: ${cleaned} usuarios removidos`);
    }
}, CLEANUP_INTERVAL);

app.get('/online', (req, res) => {
    const count = Math.max(1, activeUsers.size);
    res.json({ count: count });
});

app.post('/ping', (req, res) => {
    // Mejor identificación (usamos combinación de IP + User-Agent)
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const userId = `${ip}-${userAgent}`.slice(0, 100); // Identificador único

    activeUsers.set(userId, Date.now());

    const count = activeUsers.size;

    console.log(`Ping recibido - Usuarios en línea: ${count}`);

    res.json({ 
        success: true, 
        count: count 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ CeboScripts Online Counter corriendo en puerto ${PORT}`);
});
