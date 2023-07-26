require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const URL = require('url').URL;
const { Configuration, OpenAIApi } = require('openai');

// Express application.
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5500;

if (!process.env.OPENAI_API_KEY) {
    console.log("Missing OPENAI_API_KEY environment variable");
    process.exit(1);
}


// Configure the OpenAI API
const configuration = new Configuration({
    organization: organizationId,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function chatGptAnalyze(prompt) {
    try {
        const response = await openai.createCompletion({
            engine: 'text-davinci-002',
            prompt: prompt,
            max_tokens: 2000
        });
        const analysis = response.choices[0].text.trim();
        return analysis;
    } catch (err) {
        console.error("OpenAI API Call Error:", err);
        throw err; // throw the error to be caught by the route handler
    }
}



app.post('/scrape', (req, res) => {
    let url = req.body.url;
    
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }

    const instance = axios.create({
        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537'}
    });

    instance.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            let termsUrl;
            //find link
            $('*').each(function() {
                const text = $(this).text().toLowerCase();

                if (text.includes('terms')) {
                    const href = $(this).attr('href');
                    if (href) {
                        termsUrl = new URL(href, url).href;
                    }
                }
            });

            if (!termsUrl) {
                res.send('Could not find a link to the terms and conditions page');
                return;
            }

            instance.get(termsUrl)
                .then(response => {
                    const termsHtml = response.data;
                    const $terms = cheerio.load(termsHtml);

                    const termsText = $terms('body').text();
                    const termsIndex = termsText.toLowerCase().indexOf('terms');
                    const filteredText = termsText.substring(termsIndex).replace(/\s\s+/g, ' ');
                    const endIndex = filteredText.indexOf('©');
                    const finalText = filteredText.substring(0, endIndex);
                    
                    // return the scraped text
                    res.json({tosText: finalText});
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send(err.message);
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err.message);
        });
});



app.post('/analyze', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        console.log('Received a request to /analyze with the following prompt:', prompt);
        const analysis = await chatGptAnalyze(prompt);
        console.log('Analysis completed successfully:', analysis);
        res.json({ analysis: analysis });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
