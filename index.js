const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let onlineCount = 0;

app.get('/online', (req, res) => {
    res.json({ count: onlineCount });
});

app.post('/ping', (req, res) => {
    onlineCount = Math.max(1, onlineCount + 1);
    
    setTimeout(() => {
        onlineCount = Math.max(1, onlineCount - 1);
    }, 45000);

    res.json({ success: true, count: onlineCount });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Online counter running on port ${PORT}`);
});
