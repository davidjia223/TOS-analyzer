require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const URL = require('url').URL;
const app = express();
app.use(express.static('public'));


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.ORGANIZATION_ID || 'org-TJTOw16i4ecJ3TZGokAd5QXy',
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());


app.post('/scrape', async (req, res) => {
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
                console.log('Could not find a link to the terms and conditions page');
                res.send('Could not find a link to the terms and conditions page');
                return;
            }

            instance.get(termsUrl)
                .then(async response => {
                    const termsHtml = response.data;
                    const $terms = cheerio.load(termsHtml);

                    const termsText = $terms('body').text();
                    const termsIndex = termsText.toLowerCase().indexOf('terms');
                    const filteredText = termsText.substring(termsIndex).replace(/\s\s+/g, ' ');
                    const endIndex = filteredText.indexOf('©');
                    const finalText = filteredText.substring(0, endIndex);

                    console.log('finalText Index:', finalText);

                    const promptText = "Please analyze the following to tell if it is normal or not. Keep it clean and precise analyze. Analyze like a robot that is trying to scan for virus, but instead scan for inprecise texting and give me a value bar of abnormalness: " + finalText;

                    const openaiResponse = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: promptText,
                        max_tokens: 2000,
                        temperature: 0.7,
                        top_p:1.0,
                        n: 1,
                    });

                    console.log('Analyzed Text:', openaiResponse.data.choices[0].text);

                    res.json({tosText: finalText, analysis: openaiResponse.data});
                })
                .catch(err => {
                    console.log(err.message);
                    res.status(500).send(err.message);
                });
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send(err.message);
        });
});

app.listen(3000, () => console.log('Server running on port 3000'));
