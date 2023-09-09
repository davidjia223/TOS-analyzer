//analyze.js
document.getElementById('back-button').addEventListener('click', function() {
    //Back button , redirection.
    window.location.href = "/index.html";
});


document.getElementById('analyze-button').addEventListener('click', function() {
    // should be replaced with this:
    const text = localStorage.getItem('tosText') || "No text found";
    console.log('Retrieved terms of service text from localStorage:', text);

    const prompt = `
    Given the service's features, which include:
Auto-detection of terms and conditions pages,
Emphasizing key sections,
Offering a 5-point summary,
User-friendly browser extension,
Straightforward instructions,
A reminder to users emphasizing the importance of reading the terms and conditions in full,
The primary goal of this service is to simplify and expedite the process of reviewing terms and conditions, with a particular focus on assisting senior individuals.
With that in mind, kindly assess the following Terms of Service. Please pinpoint and elucidate any clauses or segments that might diverge from standard norms or practices. Elaborate on why such elements could be perceived as unusual or potentially contentious: ${text}`;

    fetch('http://localhost:5500/analyze', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: prompt })
})

    .then(response => response.json())
    .then(data => {
        document.getElementById('analysis-result').textContent = data.analysis;
        
        // Analysis stored in localStorage
        localStorage.setItem('fullAnalysis', data.analysis);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Could not analyze the terms of service. Please try again.');
    });
    
});