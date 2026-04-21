require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flowsRouter = require('./routes/flows');
const scenariosRouter = require('./routes/scenarios');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/flows', flowsRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
