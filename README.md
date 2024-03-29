# Analyzed Terms of Service

## Overview

A web app that automatically checks a website's Terms of Service (ToS) and highlights unusual or problematic sections. It helps make reading ToS easier and saves time for everyone, including older people.

![Animation](https://github.com/davidjia223/TOS-analyzer/assets/45841175/4ee8c368-cec8-4305-b587-6dfcc4c7a73f)

## Key Features

- **Auto-opens ToS pages**: Automatically opens a website's terms and conditions page.
- **Highlights important parts**: Marks key parts of the ToS.
- **Detailed Analysis**: Provides a detailed analysis, highlighting any clauses or sections that deviate from commonly accepted standards or practices, and explaining why they might be considered unusual or potentially problematic.
- **Provides Key summary Lines**: Gives a summary of the key points in the ToS. 
- **Expantion of explanation**: Ability to see how the natural language process classify sentences and words as positive or negative.
- **Clear instructions**: The application provides clear instructions to the user for custimization
- **Browser extension**: Can be used as a browser extension. (WIP)

## How it works

The application uses the RestAPI and OpenAI API to analyze the terms of service of a website. It first scrapes the terms of service from the website, then processes the text to filter out common legal sentences, then identify negative sentences and broad statements. The processed text is then sent to the OpenAI API for analysis. The results from the API are displayed on the web page.

## Installation

1. Clone the repository.
2. Install the necessary packages by running `npm install`.
3. Start the server by running `npm start`.
4. Open a web browser and navigate to `http://localhost:5500`.

## How To Use
Run `npm start` to start the server.
Go to http://localhost:5500 in a web browser.
Enter the website URL you want to analyze.
Click "Submit".

## Tools and Technologies used

- RestAPI
- Express
- Axios
- Cheerio
- CORS
- OpenAI
- Natural
- Compromise , Compromise-sentences
- dotenv
- URL
- fs (File System)
- commonLegalSentences
    
## License

[MIT](https://choosealicense.com/licenses/mit/)

## Disclaimer

This app assumes that the ToS can be located by searching for 'terms' in the website's HTML. The analysis is informational only, not legal advice. The app and its developers are not liable for inaccuracies or any consequences arising from the use of the application.
