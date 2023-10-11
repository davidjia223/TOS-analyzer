// trainClassifier.js

const natural = require('natural');
const classifier = new natural.BayesClassifier();
const wordnet = new natural.WordNet();
const stemmer = natural.PorterStemmer;
const stopwords = natural.stopwords;
const customStopwords = ['the', 'a', 'an', 'and', 'but', 'if', 'or', 'because', 'as', 'what', 'which', 'this', 'that', 'these', 'those', 'then',
'so', 'than', 'such', 'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to', 'What', 'Which', 'Is', 'If', 'While', 'This', 'It', 'Not'];


// add stopwords filtering and stemming when processing sentences
const processSentence = (sentence) => {
    const tokenizer = new natural.WordTokenizer();
    const tokenized = tokenizer.tokenize(sentence);
    const filtered = tokenized.filter(word => !customStopwords.includes(word));
    return filtered.map(word => stemmer.stem(word)).join(' ');
}


const replaceSynonyms = async (sentence) => {
  const words = sentence.split(' ');
  for (let i = 0; i < words.length; i++) {
    const synonyms = await new Promise((resolve) => {
      wordnet.lookup(words[i], (results) => {
        resolve(results.map((result) => result.synonyms).flat());
      });
    });
    if (synonyms.length > 0) {
      words[i] = synonyms[0]; // Replace with the first synonym
    }
  }
  return words.join(' ');
};

// Pseudo-code for back translation
const backTranslate = async (sentence) => {
    const translated = await translateToAnotherLanguage(sentence);
    return await translateBackToOriginalLanguage(translated);
};


// Random deletion of words
const randomDeletion = (sentence, p=0.2) => {
    const words = sentence.split(' ');
    return words.filter(() => Math.random() > p).join(' ');
};

// Add augmented data to the classifier
const addAugmentedData = async (sentence, label) => {
    classifier.addDocument(processSentence(sentence), label);
    const augmentedSentence = await replaceSynonyms(sentence);
    classifier.addDocument(processSentence(augmentedSentence), label);
  };

// "positive" sentences: these don't seem to involve anything harmful or suspicious
(async () => {
await addAugmentedData('Your data will only be used to improve your experience.', 'positive');
await addAugmentedData('We respect your privacy and will not share your data with third parties without your consent.', 'positive');
await addAugmentedData('In the event of a dispute, we aim to resolve it amicably with your best interests at heart.', 'positive');
await addAugmentedData('You have the right to delete your data at any time.', 'positive');
await addAugmentedData('We protect your data using state-of-the-art encryption technologies.', 'positive');
await addAugmentedData('We will notify you immediately in case of a data breach.', 'positive');
await addAugmentedData('Your consent will be requested before we share any of your personal data.', 'positive');
await addAugmentedData('We comply with all data protection laws and regulations.', 'positive');
await addAugmentedData('Your information is stored safely and securely.', 'positive');
await addAugmentedData('We require your explicit permission to share your information.', 'positive');
await addAugmentedData('All data related disputes are handled in a customer-centric manner.', 'positive');
await addAugmentedData('User data is encrypted with industry-standard security measures.', 'positive');
await addAugmentedData('We aim to alert users promptly if any data breach occurs.', 'positive');

// "negative" sentences: these involve data sharing, potential privacy issues, or other matters of concern
await addAugmentedData('Reserves the right, at its sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time.', 'negative');
await addAugmentedData('We may share your personal information with our affiliates.', 'negative');
await addAugmentedData('We may change the privacy policy at any time without notice.', 'negative');
await addAugmentedData('By using our services, you consent to our use of cookies and similar technologies.', 'negative');
await addAugmentedData('We are not responsible for any third-party links that you access through our service.', 'negative');
await addAugmentedData('We reserve the right to disclose your personal information if required by law or in response to legal proceedings.', 'negative');
await addAugmentedData('In the event of a merger or acquisition, your personal information may be transferred to the new entity.', 'negative');
await addAugmentedData('We may track your browsing habits to serve you targeted advertising.', 'negative');
await addAugmentedData('We may store your data in servers located in other countries.', 'negative');
await addAugmentedData('Your data will be stored for an indefinite period even after account deletion.', 'negative');
await addAugmentedData('Your non-personally identifiable information may be provided to other parties for marketing, advertising, or other uses.', 'negative');
await addAugmentedData('Disputes will be resolved in our sole discretion', 'negative');
await addAugmentedData('We may disclose your information to our business partners', 'negative');
await addAugmentedData('We may sell your personal information to third parties for marketing purposes.', 'negative');
await addAugmentedData('We may change our Terms of Service without giving any notice.', 'negative');
await addAugmentedData('We hold no responsibility for any data loss or security breaches.', 'negative');
await addAugmentedData('Your data may be processed in countries with lower data protection standards.', 'negative');
await addAugmentedData('By using our service, you give up your right to take any disputes to court.', 'negative');
await addAugmentedData('We have the right to suspend or terminate your account without prior notice or reason.', 'negative');
await addAugmentedData('You must be at least 18 years old to use our service.', 'negative');
await addAugmentedData('We may retain your data indefinitely.', 'negative');
await addAugmentedData('We allow third-party companies to serve ads and/or collect certain anonymous information.', 'negative');
await addAugmentedData('These terms shall be governed by the laws of the state of California.', 'negative');
await addAugmentedData('We may terminate your account at any time for any reason.', 'negative');
await addAugmentedData('We reserve the right to use any user-generated content.', 'negative');
await addAugmentedData('We disclaim all warranties, express or implied.', 'negative');
await addAugmentedData('You agree to indemnify us against any claims or legal proceedings.', 'negative');
await addAugmentedData('We may change or discontinue the service at any time without notice.', 'negative');
await addAugmentedData('We may use your data for automated decision-making, including profiling.', 'negative');
await addAugmentedData('We can amend these terms at any time without notifying you.', 'negative');
await addAugmentedData('Our company is allowed to share your personal details with associated entities.', 'negative');
await addAugmentedData('We possess the authority to alter the privacy policy unannounced.', 'negative');
await addAugmentedData('Acceptance of cookies is mandatory to use our services.', 'negative');
await addAugmentedData('We bear no responsibility for third-party links on our platform.', 'negative');
await addAugmentedData('We may disclose your data under legal circumstances without your consent.', 'negative');
await addAugmentedData('In case of a company merger, your personal data may be shared.', 'negative');
await addAugmentedData('We may monitor your activity for targeted advertising.', 'negative');
await addAugmentedData('Your personal data might be stored on overseas servers.', 'negative');
await addAugmentedData('We are allowed to retain your data indefinitely post-account termination.', 'negative');
await addAugmentedData('We can distribute non-personal data for advertising and other purposes.', 'negative');
await addAugmentedData('Disputes will be resolved as per our company’s discretion.', 'negative');
await addAugmentedData('We have the authority to share your information with business partners.', 'negative');
await addAugmentedData('We reserve the right to sell your information for promotional activities.', 'negative');
await addAugmentedData('We have the freedom to amend our Terms of Service without prior information.', 'negative');
await addAugmentedData('We assume no responsibility for data loss or security infringements.', 'negative');
await addAugmentedData('Your data may be managed in regions with less stringent data protection.', 'negative');
await addAugmentedData('Your consent to use our service relinquishes your rights to legal dispute resolutions.', 'negative');
await addAugmentedData('We can cease or suspend your account without any prior information or justification.', 'negative');
await addAugmentedData('Users must be 18 years or older to access our services.', 'negative');
await addAugmentedData('We permit third-party firms to advertise and gather anonymous data.', 'negative');
await addAugmentedData('Our terms are governed by Californian law.', 'negative');
await addAugmentedData('We can terminate your account without providing a reason.', 'negative');
await addAugmentedData('We reserve the right to use content generated by users.', 'negative');
await addAugmentedData('All warranties, whether stated or implied, are disclaimed.', 'negative');
await addAugmentedData('You consent to hold us harmless from any claims or legal proceedings.', 'negative');
await addAugmentedData('We can discontinue the service without notifying you.', 'negative');
await addAugmentedData('We have the right to use your data for decision-making and profiling.', 'negative');
await addAugmentedData('We reserve the right to sell your personal information to the highest bidder without your consent..', 'negative');
await addAugmentedData('We may disclose your medical records to third parties for profit.', 'negative');
await addAugmentedData('Your data may be shared with organizations that have a history of data breaches.', 'negative');
await addAugmentedData('We may use your personal photos for advertising without your explicit permission.', 'negative');
await addAugmentedData('We have the right to use your data for decision-making and profiling.', 'negative');
;


classifier.train();
})();

// ... add more examples

module.exports = {
    classifier,
    processSentence
  };