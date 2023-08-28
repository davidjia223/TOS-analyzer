// trainClassifier.js

const natural = require('natural');
const classifier = new natural.BayesClassifier();

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
 
// "positive" sentences: these don't seem to involve anything harmful or suspicious

classifier.addDocument(processSentence('Your data will only be used to improve your experience.'), 'positive');
classifier.addDocument(processSentence('We respect your privacy and will not share your data with third parties without your consent.'), 'positive');
classifier.addDocument(processSentence('In the event of a dispute, we aim to resolve it amicably with your best interests at heart.'), 'positive');
classifier.addDocument(processSentence('You have the right to delete your data at any time.'), 'positive');
classifier.addDocument(processSentence('We protect your data using state-of-the-art encryption technologies.'), 'positive');
classifier.addDocument(processSentence('We will notify you immediately in case of a data breach.'), 'positive');
classifier.addDocument(processSentence('Your consent will be requested before we share any of your personal data.'), 'positive');
classifier.addDocument(processSentence('We comply with all data protection laws and regulations.'), 'positive');
classifier.addDocument(processSentence('Your information is stored safely and securely.'), 'positive');
classifier.addDocument(processSentence('We require your explicit permission to share your information.'), 'positive');
classifier.addDocument(processSentence('All data related disputes are handled in a customer-centric manner.'), 'positive');
classifier.addDocument(processSentence('User data is encrypted with industry-standard security measures.'), 'positive');
classifier.addDocument(processSentence('We aim to alert users promptly if any data breach occurs.'), 'positive');

// "negative" sentences: these involve data sharing, potential privacy issues, or other matters of concern
classifier.addDocument(processSentence('Reserves the right, at its sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time.'), 'negative');
classifier.addDocument(processSentence('We may share your personal information with our affiliates.'), 'negative');
classifier.addDocument(processSentence('We may change the privacy policy at any time without notice.'), 'negative');
classifier.addDocument(processSentence('By using our services, you consent to our use of cookies and similar technologies.'), 'negative');
classifier.addDocument(processSentence('We are not responsible for any third-party links that you access through our service.'), 'negative');
classifier.addDocument(processSentence('We reserve the right to disclose your personal information if required by law or in response to legal proceedings.'), 'negative');
classifier.addDocument(processSentence('In the event of a merger or acquisition, your personal information may be transferred to the new entity.'), 'negative');
classifier.addDocument(processSentence('We may track your browsing habits to serve you targeted advertising.'), 'negative');
classifier.addDocument(processSentence('We may store your data in servers located in other countries.'), 'negative');
classifier.addDocument(processSentence('Your data will be stored for an indefinite period even after account deletion.'), 'negative');
classifier.addDocument(processSentence('Your non-personally identifiable information may be provided to other parties for marketing, advertising, or other uses.'), 'negative');
classifier.addDocument(processSentence('disputes will be resolved in our sole discretion'), 'negative');
classifier.addDocument(processSentence('we may disclose your information to our business partners'), 'negative');
classifier.addDocument(processSentence('We may sell your personal information to third parties for marketing purposes.'), 'negative');
classifier.addDocument(processSentence('We may change our Terms of Service without giving any notice.'), 'negative');
classifier.addDocument(processSentence('We hold no responsibility for any data loss or security breaches.'), 'negative');
classifier.addDocument(processSentence('Your data may be processed in countries with lower data protection standards.'), 'negative');
classifier.addDocument(processSentence('By using our service, you give up your right to take any disputes to court.'), 'negative');
classifier.addDocument(processSentence('We have the right to suspend or terminate your account without prior notice or reason.'), 'negative');
classifier.addDocument(processSentence('You must be at least 18 years old to use our service.'), 'negative');
classifier.addDocument(processSentence('We may retain your data indefinitely.'), 'negative');
classifier.addDocument(processSentence('We allow third-party companies to serve ads and/or collect certain anonymous information.'), 'negative');
classifier.addDocument(processSentence('These terms shall be governed by the laws of the state of California.'), 'negative');
classifier.addDocument(processSentence('We may terminate your account at any time for any reason.'), 'negative');
classifier.addDocument(processSentence('We reserve the right to use any user-generated content.'), 'negative');
classifier.addDocument(processSentence('We disclaim all warranties, express or implied.'), 'negative');
classifier.addDocument(processSentence('You agree to indemnify us against any claims or legal proceedings.'), 'negative');
classifier.addDocument(processSentence('We may change or discontinue the service at any time without notice.'), 'negative');
classifier.addDocument(processSentence('We may use your data for automated decision-making, including profiling.'), 'negative');
classifier.addDocument(processSentence('We can amend these terms at any time without notifying you.'), 'negative');
classifier.addDocument(processSentence('Our company is allowed to share your personal details with associated entities.'), 'negative');
classifier.addDocument(processSentence('We possess the authority to alter the privacy policy unannounced.'), 'negative');
classifier.addDocument(processSentence('Acceptance of cookies is mandatory to use our services.'), 'negative');
classifier.addDocument(processSentence('We bear no responsibility for third-party links on our platform.'), 'negative');
classifier.addDocument(processSentence('We may disclose your data under legal circumstances without your consent.'), 'negative');
classifier.addDocument(processSentence('In case of a company merger, your personal data may be shared.'), 'negative');
classifier.addDocument(processSentence('We may monitor your activity for targeted advertising.'), 'negative');
classifier.addDocument(processSentence('Your personal data might be stored on overseas servers.'), 'negative');
classifier.addDocument(processSentence('We are allowed to retain your data indefinitely post account termination.'), 'negative');
classifier.addDocument(processSentence('We can distribute non-personal data for advertising and other purposes.'), 'negative');
classifier.addDocument(processSentence('Disputes will be resolved as per our company’s discretion.'), 'negative');
classifier.addDocument(processSentence('We have the authority to share your information with business partners.'), 'negative');
classifier.addDocument(processSentence('We reserve the right to sell your information for promotional activities.'), 'negative');
classifier.addDocument(processSentence('We have the freedom to amend our Terms of Service without prior information.'), 'negative');
classifier.addDocument(processSentence('We assume no responsibility for data loss or security infringements.'), 'negative');
classifier.addDocument(processSentence('Your data may be managed in regions with less stringent data protection.'), 'negative');
classifier.addDocument(processSentence('Your consent to use our service relinquishes your rights to legal dispute resolutions.'), 'negative');
classifier.addDocument(processSentence('We can cease or suspend your account without any prior information or justification.'), 'negative');
classifier.addDocument(processSentence('Users must be 18 years or older to access our services.'), 'negative');
classifier.addDocument(processSentence('We permit third-party firms to advertise and gather anonymous data.'), 'negative');
classifier.addDocument(processSentence('Our terms are governed by Californian law.'), 'negative');
classifier.addDocument(processSentence('We can terminate your account without providing a reason.'), 'negative');
classifier.addDocument(processSentence('We reserve the right to use content generated by users.'), 'negative');
classifier.addDocument(processSentence('All warranties, whether stated or implied, are disclaimed.'), 'negative');
classifier.addDocument(processSentence('You consent to hold us harmless from any claims or legal proceedings.'), 'negative');
classifier.addDocument(processSentence('We can discontinue the service without notifying you.'), 'negative');
classifier.addDocument(processSentence('We have the right to use your data for decision-making and profiling.'), 'negative');
// ... add more examples
classifier.train();
module.exports = {
    classifier,
    processSentence
  };