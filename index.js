const puppeteer = require('puppeteer-core');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html } = req.body;

        if (!html) {
            return res.status(400).send('HTML content is required.');
        }

        const browser = await puppeteer.connect({
            browserWSEndpoint: 'wss://pdf-melkabi-chrome-w5fqqa4ej2.liara.run?token=Zq5wX2WpCiNZQf_XKi1C',
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).send('Failed to generate PDF');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ PDF Generator server is running on http://localhost:${PORT}`);
});
