const puppeteer = require('puppeteer-core');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html } = req.body;

        if (!html) {
            console.error('HTML content is missing in the request body.');
            return res.status(400).send('HTML content is required.');
        }

        console.log('Connecting to Puppeteer browser...');
        const browser = await puppeteer.connect({
            browserWSEndpoint: 'wss://pdf-melkabi-chrome-w5fqqa4ej2.liara.run?token=Zq5wX2WpCiNZQf_XKi1C',
        });

        console.log('Opening a new page...');
        const page = await browser.newPage();

        console.log('Setting content to the page...');
        await page.setContent(html, { waitUntil: 'networkidle0' });

        console.log('Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        console.log('Closing browser...');
        await browser.close();

        console.log('Sending PDF response...');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.end(pdfBuffer, 'binary');

    } catch (error) {
        console.error('Error generating PDF:', error);

        // Write error details to a file for debugging
        fs.writeFileSync('/tmp/pdf_error_log.txt', `Error: ${error.message}\nStack: ${error.stack}`);

        res.status(500).send('Failed to generate PDF');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ PDF Generator server is running on port ${PORT}`);
    fs.appendFileSync('/tmp/server_log.txt', `Server started on port ${PORT}\n`);
});
