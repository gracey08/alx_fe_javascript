// Array to hold quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

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
}

// Event listener for showing a new quote
newQuoteButton.addEventListener('click', showRandomQuote);

// Function to create and manage the form for adding new quotes
function createAddQuoteForm() {
    // This function is not needed as the form is already in the HTML, but here's how you might update it dynamically:
    // const form = document.createElement('div');
    // form.innerHTML = `
    //     <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    //     <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    //     <button onclick="addQuote()">Add Quote</button>
    // `;
    // document.body.appendChild(form);
}

// Function to add a new quote to the array and update the DOM
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        // Show the newly added quote
        showRandomQuote();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Initial quote display on page load
showRandomQuote();