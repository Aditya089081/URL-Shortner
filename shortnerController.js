import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';

const filePath = join(process.cwd(), 'model', 'data.txt');

function readData() {
    if (!existsSync(filePath)) return {};
    try {
        const content = readFileSync(filePath, 'utf-8');
        return content ? JSON.parse(content) : {};
    } catch (err) {
        console.error("Read error:", err);
        return {};
    }
}

function writeData(data) {
    try {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Write error:", err);
    }
}

export const renderHome = (req, res) => {
    res.render('index', { shortUrl: null });
};

export const handleShortner = (req, res) => {
    const { url, shorten } = req.body;
    console.log("Received body:", req.body); 

    let data = readData();
    const shortId = shorten || nanoid(4);

    console.log("Generated shortId:", shortId);
    data[shortId] = url;

    writeData(data);
    console.log("Data written:", data); 

    const host = req.headers.host;
    res.render('index', { shortUrl: `http://${host}/${shortId}` });
};

export const handleRedirect = (req, res) => {
    const data = readData();
    const shortId = req.params.shortId;
    if (data[shortId]) {
        res.redirect(data[shortId]);
    } else {
        res.status(404).send("Short URL not found");
    }
};
