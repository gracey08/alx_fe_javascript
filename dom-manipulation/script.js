// Global quotes array
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

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
    populateCategories();
    filterQuotes(); // Display quotes on load with the saved or default filter
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote from the filtered set
function showRandomQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    quoteDisplay.innerHTML = ''; // Clear old quote
    quoteDisplay.appendChild(quoteElement);
}

// Event listener for showing a new quote
newQuoteButton.addEventListener('click', () => {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    showRandomQuote(filteredQuotes);
});

// Function to add a new quote to the array and update storage
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Save to local storage
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories(); // Update categories dropdown
        filterQuotes(); // Refresh display
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Function to populate categories in the dropdown
function populateCategories() {
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    const lastCategory = localStorage.getItem('lastCategory') || 'all';
    categoryFilter.value = lastCategory;
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastCategory', selectedCategory); // Save last selected filter
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    showRandomQuote(filteredQuotes);
}

// JSON export function remains unchanged

// JSON import function with category update
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update categories after import
        alert('Quotes imported successfully!');
        filterQuotes(); // Refresh display with new quotes and potentially new categories
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes when the page initializes
loadQuotes();