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
// ... (previous code) ...

// Mock API endpoint for quotes (using JSONPlaceholder for simulation)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

let lastSync = 0; // Timestamp for last sync operation

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        // Convert server data to our quote format
        return serverQuotes.map(item => ({
            text: item.title,
            category: item.body.split(' ')[0] || 'Unknown' // Use first word of body as category for simulation
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return []; // Return an empty array if fetch fails
    }
}

// Function to sync local quotes with server data
async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const resolvedQuotes = resolveConflicts(quotes, serverQuotes);
        quotes = resolvedQuotes;
        saveQuotes();
        updateSyncStatus("Quotes synced with server!");
        return true; // Sync was successful
    } catch (error) {
        updateSyncStatus("Error syncing quotes with server: " + error.message);
        return false; // Sync failed
    }
}

// Function to resolve conflicts (simple strategy: server data wins)
function resolveConflicts(localQuotes, serverQuotes) {
    // This is a naive approach where server data replaces local data entirely. 
    // In real scenarios, you might compare each quote for more nuanced merging.
    return serverQuotes;
}

// Function to update sync status on UI
function updateSyncStatus(message) {
    const statusDiv = document.getElementById('syncStatus');
    statusDiv.textContent = message;
    if (message.includes('conflict')) {
        document.getElementById('manualResolve').style.display = 'block';
    } else {
        document.getElementById('manualResolve').style.display = 'none';
    }
}

// Manual conflict resolution (placeholder for UI interaction)
function manualResolve() {
    alert("Manual resolution would involve a UI where users can decide on each conflict. Here, we'll just simulate merging.");
    // Here you would show a UI for manual merging, but for simplicity:
    syncQuotes(); // Re-fetch to simulate manual resolution
}

// Periodic sync (every 10 seconds for demonstration)
setInterval(() => {
    syncQuotes();
}, 10000); // 10 seconds

// When adding a new quote, we'll also push it to the server
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        
        // Push to server simulation
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quoteText,
                body: quoteCategory
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Success:', data);
            populateCategories(); // Update categories after addition
            filterQuotes(); // Refresh display
            syncQuotes(); // Sync after adding a quote
        }).catch(error => {
            console.error('Error:', error);
            updateSyncStatus("Failed to sync new quote to server");
        });

    } else {
        alert('Please enter both a quote and a category.');
    }
}

// ... (rest of the JavaScript code) ...
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

