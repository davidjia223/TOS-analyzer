// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const URL = require('url').URL;
const nlp = require('compromise');
const OpenAI = require('openai');
const app = express();
const { extractSections } = require('./tos_filter.js');
const { classifier, processSentence } = require('./trainClassifier');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5500;

if (!process.env.OPENAI_API_KEY) {
    console.log("Missing OPENAI_API_KEY environment variable");
    process.exit(1);
}

// const organizationId = process.env.ORGANIZATION_ID || 'org-TJTOw16i4ecJ3TZGokAd5QXy';

axios.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
})

axios.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function classifySentences(tosText) {
  const doc = nlp(tosText);
  const sentences = doc.sentences().out('array');
  
  return sentences.filter(sentence => {
    const processedSentence = processSentence(sentence);
    const classification = classifier.classify(processedSentence);
    const isBroadStatement = !nlp(sentence).match('only').found && !nlp(sentence).match('limited to').found;
    return classification === 'negative' && isBroadStatement;
  }).map(sentence => {
    const processedSentence = processSentence(sentence);
    const classification = classifier.classify(processedSentence);
    const isBroadStatement = !nlp(sentence).match('only').found && !nlp(sentence).match('limited to').found;
    return { sentence, classification, isBroadStatement };
  });
}

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
                console.log('This website’s terms of service is not found. Please use with caution.');
                res.send('This website’s terms of service is not found. Please use with caution.');
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

                    const keywords = ['data use', 'privacy', 'disputes', 'cancellations', 'terms of service changes', 'data portability', 'data rectification', 'right to be forgotten'];
                    const finalfilteredText = extractSections(finalText, keywords);
                    console.log('Filtered Text:', finalfilteredText);
                    const classifications = classifySentences(finalfilteredText);

                    const promptText = "Given the service's features which include: Auto-detection of terms and conditions pages, emphasizing key sections, offering a 5-point summary, user-friendly browser extension, straightforward instructions, and a reminder to users emphasizing the importance of reading the terms in full — the primary goal is to simplify reviewing terms, especially for seniors. Now, please assess the following Terms of Service, pinpoint any clauses or segments diverging from standard norms, and explain why they might be seen as unusual or contentious: " + finalfilteredText;

                    const openaiResponse = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: promptText,
                        max_tokens: 2000,
                        temperature: 0.7,
                        top_p:1.0,
                        n: 1,
                    });
                    const analysis = openaiResponse.data.choices[0].text.trim();
                    res.json({ tosText: finalfilteredText, analysis: analysis, classifications: classifications });
                    })  
                    .catch(err => {
                    console.log(err);
                    res.status(500).send(err.message);
                    });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err.message);
        });
});


app.post('/analyze', async (req, res) => {

    
    const promptText = "Please analyze the following to tell if it is normal or not. Keep it clean and precise analyze. Analyze like a robot that is trying to scan for virus, but instead scan for imprecise texting and give me a value bar of abnormalness: " + req.body.prompt;
    try {
        console.log('Received a request to /analyze with the following prompt:', promptText);
        const openaiResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: promptText,
            max_tokens: 2000,
            temperature: 0.7,
            top_p:1.0,
            n: 1,
        });
        const analysis = openaiResponse.data.choices[0].text.trim();
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