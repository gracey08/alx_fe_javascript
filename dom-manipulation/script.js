// Global quotes array
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if none are stored
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" }
        ];
        saveQuotes(); // Save default quotes to local storage
    }
    showRandomQuote();
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    quoteDisplay.innerHTML = ''; // Clear old quote
    quoteDisplay.appendChild(quoteElement);
    
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Event listener for showing a new quote
newQuoteButton.addEventListener('click', showRandomQuote);

// Function to add a new quote to the array and update storage
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Save to local storage
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuote();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Function to export quotes to JSON
function exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote(); // Refresh the display
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes when the page initializes
loadQuotes();