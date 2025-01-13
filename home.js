// Quotes data with more variety
const quotes = [
    {
        text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        author: "النبي محمد ﷺ",
        source: "صحيح البخاري"
    },
    {
        text: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف",
        author: "النبي محمد ﷺ",
        source: "صحيح مسلم"
    },
    {
        text: "مَن كَانَ يُؤمِنُ باللهِ واليَومِ الآخِرِ فَليَقُل خَيراً أو لِيَصمُت",
        author: "النبي محمد ﷺ",
        source: "صحيح البخاري"
    },
    {
        text: "اتَّقِ اللهَ حَيثُما كُنتَ، وأَتبِعِ السَّيِّئةَ الحَسَنةَ تَمحُها",
        author: "النبي محمد ﷺ",
        source: "سنن الترمذي"
    },
    {
        text: "لا تُظهِر الشَّماتة بأخيك فيُعافيه الله ويبتليك",
        author: "النبي محمد ﷺ",
        source: "سنن الترمذي"
    },
    {
        text: "قيمة كل امرئ ما يحسنه",
        author: "علي بن أبي طالب رضي الله عنه",
        source: "نهج البلاغة"
    },
    {
        text: "العلم خير من المال، العلم يحرسك وأنت تحرس المال",
        author: "علي بن أبي طالب رضي الله عنه",
        source: "نهج البلاغة"
    },
    {
        text: "لا تنظر إلى صغر الخطيئة، ولكن انظر إلى عظم من عصيت",
        author: "البيهقي",
        source: "شعب الإيمان"
    }
];

// DOM Elements
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const sourceText = document.getElementById('source');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy-quote');
const shareWhatsappBtn = document.getElementById('share-whatsapp');
const shareFacebookBtn = document.getElementById('share-facebook');
const notification = document.getElementById('copy-notification');
const themeToggle = document.querySelector('.theme-toggle');
const qiblaBtn = document.getElementById('findQibla');
const compassContainer = document.querySelector('.compass-container');
const compassArrow = document.querySelector('.arrow');
const qiblaInfo = document.querySelector('.qibla-info');

// Theme Management
let isDarkMode = localStorage.getItem('darkMode') === 'true';
updateTheme();

function updateTheme() {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

// Quote Management
let currentQuote = null;

async function getNewQuote() {
    let newQuote;
    do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === currentQuote && quotes.length > 1);
    
    currentQuote = newQuote;
    
    // Animate quote change
    const elements = [quoteText, authorText, sourceText];
    elements.forEach(el => el.style.opacity = '0');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    quoteText.textContent = currentQuote.text;
    authorText.textContent = `- ${currentQuote.author}`;
    sourceText.textContent = currentQuote.source;
    
    elements.forEach(el => el.style.opacity = '1');
}

// Copy and Share Functionality
function copyQuote() {
    const text = `${currentQuote.text}\n${currentQuote.author}\n${currentQuote.source}`;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ بنجاح!');
    }).catch(() => {
        showNotification('حدث خطأ أثناء النسخ');
    });
}

function shareWhatsApp() {
    const text = encodeURIComponent(`${currentQuote.text}\n${currentQuote.author}\n${currentQuote.source}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareFacebook() {
    const text = encodeURIComponent(`${currentQuote.text}\n${currentQuote.author}\n${currentQuote.source}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`, '_blank');
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Qibla Finder
let qiblaInterval;

function findQibla() {
    if (!compassContainer.classList.contains('hidden')) {
        compassContainer.classList.add('hidden');
        if (qiblaInterval) clearInterval(qiblaInterval);
        return;
    }

    compassContainer.classList.remove('hidden');

    if (!navigator.permissions || !navigator.permissions.query) {
        qiblaInfo.textContent = 'عذراً، متصفحك لا يدعم هذه الخاصية';
        return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        if (result.state === 'denied') {
            qiblaInfo.textContent = 'يرجى السماح بالوصول إلى موقعك لتحديد اتجاه القبلة';
            return;
        }

        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Calculate Qibla direction (Mecca: 21.4225° N, 39.8262° E)
            const meccaLat = 21.4225;
            const meccaLng = 39.8262;
            
            const φ1 = lat * Math.PI/180;
            const φ2 = meccaLat * Math.PI/180;
            const Δλ = (meccaLng - lng) * Math.PI/180;
            
            const y = Math.sin(Δλ);
            const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
            const qiblaDirection = Math.atan2(y, x) * 180/Math.PI;

            if (window.DeviceOrientationEvent) {
                qiblaInterval = setInterval(() => {
                    window.addEventListener('deviceorientationabsolute', function(event) {
                        let compass = event.alpha;
                        let adjustedDirection = (360 - compass + qiblaDirection) % 360;
                        compassArrow.style.transform = `translate(-50%, -100%) rotate(${adjustedDirection}deg)`;
                        qiblaInfo.textContent = 'اتجاه القبلة: ' + Math.round(adjustedDirection) + '°';
                    });
                }, 100);
            } else {
                qiblaInfo.textContent = 'عذراً، جهازك لا يدعم البوصلة';
            }
        }, function() {
            qiblaInfo.textContent = 'تعذر تحديد موقعك';
        });
    });
}

// Event Listeners
newQuoteBtn.addEventListener('click', getNewQuote);
copyBtn.addEventListener('click', copyQuote);
shareWhatsappBtn.addEventListener('click', shareWhatsApp);
shareFacebookBtn.addEventListener('click', shareFacebook);
qiblaBtn.addEventListener('click', findQibla);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        getNewQuote();
    } else if (e.ctrlKey && e.code === 'KeyC') {
        e.preventDefault();
        copyQuote();
    }
});

// Touch Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (Math.abs(touchEndX - touchStartX) > 50) {
        getNewQuote();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', getNewQuote);
