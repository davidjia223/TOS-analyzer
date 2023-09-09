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
    Considering the following attributes of the service: Auto-opening for terms and conditions pages, highlighting important parts, providing 5 key summary lines, easy to use extension, clear instructions, and a disclaimer reminding viewers to read the terms and conditions. The service aims to make reading terms and conditions easier and save time, especially for elder people. Now, please review the following Terms of Service and provide a detailed analysis. Specifically, highlight any clauses or sections that deviate from commonly accepted standards or practices, and explain why they might be considered unusual or potentially problematic: ${text}
    `;

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