const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html } = req.body;

        if (!html) {
            console.error('HTML content is missing in the request body.');
            return res.status(400).json({ error: 'HTML content is required.' });
        }

        console.log('Request received successfully.');
        return res.status(200).json({ message: 'Request received successfully.', htmlLength: html.length });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Failed to process request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Debug server is running on port ${PORT}`);
});

