//tos_filter.js

const fs = require('fs');
const natural = require('natural');
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));
const classifier = require('./trainClassifier');
const commonLegalSentences = require('./commonLegalSentences');

// Define your custom stopwords here
const customStopwords = ['the', 'a', 'an', 'and', 'but', 'if', 'or', 'because', 'as', 'what', 'which', 'this', 'that', 'these', 'those', 'then',
'so', 'than', 'such', 'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to', 'What', 'Which', 'Is', 'If', 'While', 'This', 'It', 'Not'];

// Function to process sentence by removing stopwords
function processSentence(sentence) {
  let words = sentence.split(' ');
  words = words.filter(word => !customStopwords.includes(word));
  return words.join(' ');
}

// Define a function to filter out common legal sentences
function filterCommonLegalSentences(sentences, commonSentences, threshold = 0.9) {
  return sentences.filter(sentence => {
    let sentenceClauses = nlp(sentence).clauses().out('array');
    for (let i = 0; i < commonSentences.length; i++) {
      let commonClauses = nlp(commonSentences[i]).clauses().out('array');
      for (let j = 0; j < sentenceClauses.length; j++) {
        if (commonClauses[j] && natural.JaroWinklerDistance(sentenceClauses[j].toLowerCase(), commonClauses[j].toLowerCase(), {ignoreCase: true}) > threshold) {
          return false;
        }
      }
    }
    return true;
  });
}

function extractSections(text, keywords) {
  const doc = nlp(text);
  let sentences = doc.sentences().out('array'); 

  // Print each sentence before filtering
  console.log('Before filtering:');
  sentences.forEach(sentence => console.log(sentence));

  // Filter out common legal sentences
  sentences = filterCommonLegalSentences(sentences, commonLegalSentences);

  let negativeSentences = [];
  const relevantSentences = sentences.filter(sentence => {
    const docSentence = nlp(sentence);
    
    // Check if sentence includes one of the keywords
    const hasKeyword = keywords.some(keyword => docSentence.has(keyword));

    // Check if the sentence does not include limiting phrases
    const isBroadStatement = !docSentence.match('only').found && !docSentence.match('limited to').found;

    // Check if the sentence includes changes without notice
    const changesWithoutNotice = checkForChangesWithoutNotice(sentence);

    // Classify and Print the classification result and broad statement detection for each sentence
    const classification = classifier.classify(sentence);
    console.log(`\nClassification of "${sentence}": ${classification}`);
    if (isBroadStatement) {
      console.log(`Broad statement detected: "${sentence}"`);
    }

    // If the sentence is classified as 'negative', then it's added to the negativeSentences array
    if (classification === 'negative') {
      negativeSentences.push(sentence);
    }

    // If the sentence does not include a keyword or is not a broad statement, skip it
    if (!hasKeyword || (!isBroadStatement && !changesWithoutNotice)) {
      return false;
    }
    
    return true;
  });

  // Add negative sentences to the relevant sentences
  let finalText = (relevantSentences.concat(negativeSentences)).join(' ');

  // Process the final text to remove stopwords
  finalText = processSentence(finalText);

  return finalText;
}
function checkForChangesWithoutNotice(sentence) {
  const changeRegex = /change|modify|alter/i;
  const noticeRegex = /notice|inform|notify/i;

  if (changeRegex.test(sentence) && !noticeRegex.test(sentence)) {
    console.log(`Changes without notice detected: "${sentence}"`);
    return true;
  }

  return false;
}

// Load Terms of Service text from a local file
const tosText = fs.readFileSync('./tos.txt', 'utf8');

const keywords = ['data use', 'privacy', 'disputes', 'cancellations', 'terms of service changes', 'data portability', 'data rectification', 'right to be forgotten'];

const extractedText = extractSections(tosText, keywords);

console.log('Final Extracted Text:');
console.log(extractedText);
// ...rest of your provided code...

// Function that you will call to initiate the whole process
async function analyze() {
  // Load Terms of Service text from a local file
  const tosText = fs.readFileSync('./tos.txt', 'utf8');

  const keywords = ['data use', 'privacy', 'disputes', 'cancellations', 'terms of service changes', 'data portability', 'data rectification', 'right to be forgotten'];

  // Perform the first round of analysis to filter out unimportant text
  const filteredText = extractSections(tosText, keywords);
  console.log(`First Analysis Completed: ${filteredText}`);
  
  // Now the filteredText can be analyzed as per your existing analysis procedure
  // I don't see the code for the second round of analysis, but here is where it should be added.
  // You would probably call another function, similar to the 'extractSections', but for the second analysis round.
  // For example, analyzeFilteredText(filteredText);
  
  // Alternatively, you can pass the filteredText to the existing analysis function if you have one.
}

// Call the function to start the whole process
analyze();

module.exports = {
    extractSections,
  };
  