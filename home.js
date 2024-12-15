const quoteDisplay = document.getElementById('quote-display');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteButton = document.getElementById('new-quote');

async function getQuotes() {
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching quotes:", error);
        quoteText.textContent = "فشل في تحميل الاقتباسات."; // Arabic error message
        return [];
    }
}

async function generateQuote() {
    const quotes = await getQuotes();

    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteText.textContent = randomQuote.quote;
        authorText.textContent = `- ${randomQuote.author}`;
    }
}

newQuoteButton.addEventListener('click', generateQuote);

generateQuote();
