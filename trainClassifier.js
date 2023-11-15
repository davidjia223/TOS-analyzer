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
  const synonymPromises = words.map(word => {
    return new Promise((resolve) => {
      wordnet.lookup(word, (results) => {
        resolve(results.map((result) => result.synonyms).flat()[0] || word);
      });
    });
  });
  const synonyms = await Promise.all(synonymPromises);
  return synonyms.join(' ');
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
await addAugmentedData('We are not responsible for any harm or loss caused by the misuse of your personal data.', 'negative');
await addAugmentedData('We may share your location data with law enforcement agencies without a warrant.', 'negative');
await addAugmentedData('We reserve the right to monitor your private conversations for marketing purposes.', 'negative');
await addAugmentedData('Your financial information may be stored in insecure databases.', 'negative');
await addAugmentedData('We may share your contact details with known spammers.', 'negative');
await addAugmentedData('We may manipulate your account data for experimental purposes without your knowledge.', 'negative');
await addAugmentedData('We may share your biometric data with unauthorized third parties.', 'negative');
await addAugmentedData('We reserve the right to disclose your browsing history to your employer.', 'negative');
await addAugmentedData('We may sell your personal data to political organizations without your consent.', 'negative');
await addAugmentedData('We may share your personal information with entities that have been flagged for human rights violations.', 'negative');
await addAugmentedData('We reserve the right to change these terms to include additional unacceptable practices at any time.', 'negative');
await addAugmentedData('We may disclose your data under legal circumstances without your consent.', 'negative');
await addAugmentedData('We are not responsible for the accuracy or reliability of any information or content provided by third parties through the service..', 'negative');
await addAugmentedData('We are not liable for any data breaches or leaks that occur as a result of our security measures.', 'negative');
await addAugmentedData('We reserve the right to exploit your personal information for undisclosed financial gains.', 'negative');
await addAugmentedData('Your data may be used to target vulnerable individuals for deceptive marketing.', 'negative');
await addAugmentedData('We can manipulate your preferences to influence your decisions without transparency.', 'negative');
await addAugmentedData('Your personal information may be sold to the highest bidder without your knowledge.', 'negative');
await addAugmentedData('We may engage in deceptive practices to collect sensitive information.', 'negative');
await addAugmentedData('We reserve the right to violate your privacy for undisclosed purposes.', 'negative');
await addAugmentedData('Your data may be used to create false narratives and manipulate public opinion.', 'negative');
await addAugmentedData('We can share your personal information with unscrupulous actors for malicious purposes.', 'negative');
await addAugmentedData('We may employ unethical tactics to gain unauthorized access to your data.', 'negative');
await addAugmentedData('Your information may be used to deceive and defraud users for financial gain.', 'negative');
await addAugmentedData('We reserve the right to engage in illegal activities using your personal data.', 'negative');
await addAugmentedData('Your data may be exploited to undermine trust and security in online services.', 'negative');
await addAugmentedData('We can share your data with organizations involved in cyberattacks and hacking.', 'negative');
await addAugmentedData('We may engage in identity theft and impersonation using your personal information.', 'negative');
await addAugmentedData('Your information may be used for harassment and online bullying without restrictions.', 'negative');
await addAugmentedData('We reserve the right to use your data to harm your reputation and livelihood.', 'negative');
await addAugmentedData('Your data may be used to create deepfake content for malicious purposes.', 'negative');
await addAugmentedData('We can engage in online scams and fraudulent activities using your personal information.', 'negative');
await addAugmentedData('We may exploit your data to facilitate online fraud and criminal activities.', 'negative');
await addAugmentedData('We may intentionally mislead you about our data collection practices.', 'negative');
await addAugmentedData('Your personal data may be used to manipulate and control your online behavior.', 'negative');
await addAugmentedData('We reserve the right to profit from the sale of your most sensitive information.', 'negative');
await addAugmentedData('Your data may be shared with malicious actors to harm your digital identity.', 'negative');
await addAugmentedData('We can engage in cyberbullying and harassment using your personal information.', 'negative');
await addAugmentedData('We may intentionally expose your confidential data to public humiliation.', 'negative');
await addAugmentedData('Your personal information may be used for cyber espionage and sabotage.', 'negative');
await addAugmentedData('We reserve the right to engage in predatory practices targeting vulnerable users.', 'negative');
await addAugmentedData('Your data may be weaponized to undermine trust in institutions and individuals.', 'negative');
await addAugmentedData('We can use your personal information for extortion and blackmail.', 'negative');
await addAugmentedData('We may intentionally spread false information using your identity and data.', 'negative');
await addAugmentedData('Your data may be exploited for illegal financial schemes and fraud.', 'negative');
await addAugmentedData('We reserve the right to engage in identity theft and impersonation for malicious purposes.', 'negative');
await addAugmentedData('Your information may be used to facilitate online hate speech and discrimination.', 'negative');
await addAugmentedData('We can intentionally expose your vulnerabilities to cyberattacks and hacking.', 'negative');
await addAugmentedData('We may engage in online stalking and invasive surveillance using your data.', 'negative');
await addAugmentedData('Your data may be used for political manipulation and interference in elections.', 'negative');
await addAugmentedData('We reserve the right to exploit your data to harm your personal and professional life.', 'negative');
await addAugmentedData('Your personal information may be used to create and spread harmful deepfake content.', 'negative');
await addAugmentedData('We can engage in online scams and fraudulent activities that target you specifically.', 'negative');
await addAugmentedData('We may intentionally deceive you about how your data is being used for our gain.', 'negative');
await addAugmentedData('Your personal information may be exploited without remorse for our financial benefit.', 'negative');
await addAugmentedData('We reserve the right to manipulate your data to control and influence your decisions.', 'negative');
await addAugmentedData('Your data may be sold to the highest bidder, with complete disregard for your privacy.', 'negative');
await addAugmentedData('We can engage in deceptive practices to harvest sensitive information about you.', 'negative');
await addAugmentedData('We may intentionally violate your privacy for our undisclosed and unethical purposes.', 'negative');
await addAugmentedData('Your data may be weaponized to create false narratives and deceive the public.', 'negative');
await addAugmentedData('We reserve the right to share your personal information with malicious entities for harm.', 'negative');
await addAugmentedData('Your information may be used to exploit and target vulnerable individuals for our gain.', 'negative');
await addAugmentedData('We can engage in cyberbullying and harassment using your data without remorse.', 'negative');
await addAugmentedData('We may intentionally expose your confidential data for public humiliation and harm.', 'negative');
await addAugmentedData('Your personal information may be used for cyber espionage, sabotage, and criminal activities.', 'negative');
await addAugmentedData('We reserve the right to engage in predatory practices that target and exploit unsuspecting users.', 'negative');
await addAugmentedData('Your data may be weaponized to undermine trust in institutions, individuals, and society.', 'negative');
await addAugmentedData('We can use your personal information for extortion, blackmail, and malicious intent.', 'negative');
await addAugmentedData('We may intentionally spread false information and manipulate public perception using your identity and data.', 'negative');
await addAugmentedData('Your data may be exploited for illegal financial schemes, fraud, and criminal behavior.', 'negative');
await addAugmentedData('We reserve the right to engage in identity theft, impersonation, and fraudulent activities for malicious purposes.', 'negative');
await addAugmentedData('Your information may be used to facilitate online hate speech, discrimination, and harm to others.', 'negative');
await addAugmentedData('We can intentionally expose your vulnerabilities to cyberattacks, hacking, and security breaches.', 'negative');
await addAugmentedData('We may share your personal information with anyone who pays us, regardless of their intentions or affiliations.', 'negative');
await addAugmentedData('We do not conduct any screening or vetting of third parties that purchase your data from us. Your information could end up being used for illegal or harmful purposes.', 'negative');
await addAugmentedData('We may sell your personal browsing history, search queries, banking information, medical records and other sensitive data without your consent.', 'negative');
await addAugmentedData('We take no responsibility for how your data is used after it has been sold or shared with third parties. Any misuse or privacy violations are not our problem.', 'negative');
await addAugmentedData('Your data will be kept indefinitely, even after your death. We claim perpetual rights to any information provided to us now or in the future.', 'negative');
await addAugmentedData('Law enforcement and government agencies from any country can access your data without legal process or oversight. We do not restrict access to user data based on jurisdiction.', 'negative');
await addAugmentedData('We may share your personal information, including identification documents, with entities known to have ties to criminal organizations or terrorist groups.', 'negative');
await addAugmentedData('We use covert techniques like cookies, trackers and device fingerprinting to collect data about you across the web without your knowledge or consent.', 'negative');
await addAugmentedData('We automatically scan all your private files, messages and communications for commercial and data exploitation purposes. No content is off limits.', 'negative');
await addAugmentedData('Your biometric, genetic, financial, medical and other highly sensitive personal data has no additional security or access restrictions applied by us.', 'negative');
await addAugmentedData('We may manipulate algorithmic systems to selectively show, hide or change content, profiles and services available to you without transparency.', 'negative');
await addAugmentedData('We may use your personal information to create a psychological profile of you, which we may use to manipulate your behavior and decision-making.', 'negative');
await addAugmentedData('We may use your data to create a personalized feed of content that is designed to keep you engaged and active on our platform, even if it means promoting harmful or false information', 'negative');
await addAugmentedData('We may use your data to influence your political beliefs and behaviors, either directly or through third-party organizations that we support', 'negative');
await addAugmentedData('We may use your data to predict and prevent dissent or opposition to our company or our partners, either through monitoring or through active countermeasures', 'negative');
await addAugmentedData('We may share your sensitive personal data with third-party vendors without explicit consent.', 'negative');
await addAugmentedData('We reserve the right to monitor and record your online activities for data analysis.', 'negative');
await addAugmentedData('Our company is not liable for any misuse of your personal information by external entities.', 'negative');
await addAugmentedData('You relinquish your rights to privacy when using our platform.', 'negative');
await addAugmentedData('We may share your browsing history and preferences with advertisers without your knowledge.', 'negative');
await addAugmentedData('Any data you upload becomes our proprietary information, usable in any way we see fit.', 'negative');
await addAugmentedData('We may use your geographical location data for surveillance purposes.', 'negative');
await addAugmentedData('User communications may be intercepted and analyzed for quality assurance.', 'negative');


;


classifier.train();
})();

// ... add more examples

module.exports = {
    classifier,
    processSentence
  };