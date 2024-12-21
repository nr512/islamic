const quotes = [
            { text: "الدنيا متاع، وخير متاعها المرأة الصالحة", author: "النبي محمد ﷺ" },
            { text: "خير الناس أنفعهم للناس", author: "النبي محمد ﷺ" },
            { text: "إنما الأعمال بالنيات", author: "النبي محمد ﷺ" },
            // Add more quotes as needed
        ];

        const quoteText = document.getElementById('quote');
        const authorText = document.getElementById('author');
        const newQuoteBtn = document.getElementById('new-quote');
        const copyQuoteBtn = document.getElementById('copy-quote');
        const loading = document.querySelector('.loading');

        function getRandomQuote() {
            return quotes[Math.floor(Math.random() * quotes.length)];
        }

        function displayQuote() {
            const { text, author } = getRandomQuote();
            quoteText.textContent = text;
            authorText.textContent = author;
        }

        function copyQuote() {
            const textToCopy = `${quoteText.textContent} - ${authorText.textContent}`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyQuoteBtn.textContent = 'تم النسخ!';
                    setTimeout(() => {
                        copyQuoteBtn.textContent = 'نسخ الاقتباس';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }

        // Initial quote display
        window.addEventListener('load', () => {
            setTimeout(() => {
                loading.style.display = 'none';
                displayQuote();
            }, 2000);
        });

        newQuoteBtn.addEventListener('click', displayQuote);
        copyQuoteBtn.addEventListener('click', copyQuote);
