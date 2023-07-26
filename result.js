//result.js
document.getElementById('analyze-button').addEventListener('click', function() {
    // Parse the result from JSON to an object
    const resultObj = JSON.parse(result);
    const result = sessionStorage.getItem('result');


    // Save the tosText to localStorage
    localStorage.setItem('tosText', resultObj.tosText);
    
    // Redirect to the analysis page
    window.location.href = "/analyze.html";
});
