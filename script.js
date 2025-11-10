// SDIWare Website - Main JavaScript

// Current language
let currentLang = 'en';

// Format rotation configuration (using translation keys)
const formatPairs = [
    ['sdi', 'ndi'],
    ['ndi', 'sdi'],
    ['ip2110', 'webrtc'],
    ['webrtc', 'ip2110'],
    ['sdi', 'srt'],
    ['srt', 'sdi'],
    ['ip2110', 'cef'],
    ['cef', 'ip2110'],
    ['ndi', 'webrtc'],
    ['webrtc', 'ndi']
];

let currentFormatIndex = 0;
let rotationInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== SDIWare Initialization ===');
    console.log('Translations available:', typeof translations !== 'undefined');
    console.log('Available languages:', translations ? Object.keys(translations) : 'none');

    initLanguageSwitcher();
    initSmoothScrolling();
    initAnimations();
    initFormatRotation();
    initUICarousel();
    initUseCaseTabs();
    initDownloadForm();

    // Check for saved language preference and apply AFTER initialization
    const savedLang = localStorage.getItem('sdiware-lang');
    const langToLoad = (savedLang && translations && translations[savedLang]) ? savedLang : 'en';

    console.log('Loading language:', langToLoad);
    const langDropdown = document.getElementById('language-dropdown');
    if (langDropdown) {
        langDropdown.value = langToLoad;
    }
    switchLanguage(langToLoad);
});

// Language Switcher
function initLanguageSwitcher() {
    const langDropdown = document.getElementById('language-dropdown');
    
    if (langDropdown) {
        console.log('Language dropdown found');
        langDropdown.addEventListener('change', (e) => {
            const lang = e.target.value;
            console.log('Language changed to:', lang);
            switchLanguage(lang);
        });
    } else {
        console.error('Language dropdown not found!');
    }
}

function switchLanguage(lang) {
    console.log('Switching to language:', lang);

    if (!translations || !translations[lang]) {
        console.error('Translation not found for:', lang);
        return;
    }

    currentLang = lang;

    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;

    // Update dropdown value
    const langDropdown = document.getElementById('language-dropdown');
    if (langDropdown) {
        langDropdown.value = lang;
    }

    // Update all translated elements
    let translatedCount = 0;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);

        // Check for undefined/null, but allow empty strings
        if (translation !== undefined && translation !== null) {
            element.textContent = translation;
            translatedCount++;

            // Special logging for titleSuffix
            if (key === 'hero.titleSuffix') {
                console.log(`Title suffix set to: "${translation}" (length: ${translation.length})`);
            }
        } else {
            console.warn('Translation missing for key:', key);
        }
    });

    // Update elements with HTML content (for links, formatted text, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const translation = getNestedTranslation(translations[lang], key);

        if (translation !== undefined && translation !== null) {
            element.innerHTML = translation;
            translatedCount++;
        } else {
            console.warn('Translation missing for key:', key);
        }
    });

    // Update format text with current language
    updateFormatText();

    console.log('Translated', translatedCount, 'elements');

    // Save language preference
    localStorage.setItem('sdiware-lang', lang);
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Active Navigation
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--accent-teal)';
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card, .device-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Navbar hide on scroll down (mobile)
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (window.innerWidth <= 768) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScroll = currentScroll;
});

// Keyboard navigation for language selector
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '5') {
        const langs = ['en', 'fr', 'de', 'es', 'it'];
        const index = parseInt(e.key) - 1;
        if (langs[index]) {
            switchLanguage(langs[index]);
        }
    }
});

// Helper function to get translated format name
function getFormatTranslation(formatKey) {
    if (!translations || !translations[currentLang]) {
        return formatKey;
    }
    return translations[currentLang].formats[formatKey] || formatKey;
}

// Helper function to update format text
function updateFormatText() {
    const formatLeft = document.getElementById('format-left');
    const formatRight = document.getElementById('format-right');

    if (!formatLeft || !formatRight) {
        console.warn('updateFormatText: Elements not found');
        return;
    }

    const [leftKey, rightKey] = formatPairs[currentFormatIndex];
    const leftText = getFormatTranslation(leftKey);
    const rightText = getFormatTranslation(rightKey);

    console.log(`Setting format text: ${leftText} ↔ ${rightText} (lang: ${currentLang})`);

    formatLeft.textContent = leftText;
    formatRight.textContent = rightText;
}

// Format rotation for hero title
function initFormatRotation() {
    console.log('=== Initializing Format Rotation ===');

    const formatLeft = document.getElementById('format-left');
    const formatRight = document.getElementById('format-right');

    console.log('Format left element:', formatLeft);
    console.log('Format right element:', formatRight);

    if (!formatLeft || !formatRight) {
        console.error('Format elements not found!');
        return;
    }

    console.log('Format rotation starting...');
    console.log('Format pairs:', formatPairs);

    // Set initial text
    updateFormatText();
    console.log('Initial format text set');

    // Clear any existing interval
    if (rotationInterval) {
        clearInterval(rotationInterval);
        console.log('Cleared existing interval');
    }

    // Start rotation
    rotationInterval = setInterval(() => {
        console.log('=== Rotation tick at', new Date().toLocaleTimeString(), '===');

        // Fade out
        formatLeft.classList.add('fade-out');
        formatRight.classList.add('fade-out');
        console.log('Fading out...');

        // Update text after fade out
        setTimeout(() => {
            currentFormatIndex = (currentFormatIndex + 1) % formatPairs.length;
            console.log('New index:', currentFormatIndex);

            updateFormatText();
            console.log('Format text updated');

            // Fade in
            formatLeft.classList.remove('fade-out');
            formatRight.classList.remove('fade-out');
            console.log('Fading in...');
        }, 300);
    }, 5000);

    console.log('Rotation interval set (ID:', rotationInterval, ')');
}

// UI Carousel for hero section screenshots
let currentUIIndex = 0;
let uiCarouselInterval = null;

function initUICarousel() {
    console.log('=== Initializing UI Carousel ===');

    const uiImages = document.querySelectorAll('.hero-ui-image');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!uiImages || uiImages.length === 0) {
        console.log('No UI images found, skipping carousel');
        return;
    }

    console.log('Found', uiImages.length, 'UI images');

    // Function to update carousel (images and indicators)
    function goToSlide(index) {
        // Remove active class from current image and dot
        uiImages[currentUIIndex].classList.remove('active');
        dots[currentUIIndex].classList.remove('active');

        // Update index
        currentUIIndex = index;

        // Add active class to new image and dot
        uiImages[currentUIIndex].classList.add('active');
        dots[currentUIIndex].classList.add('active');

        console.log('Showing image', currentUIIndex);
    }

    // Function to start auto-rotation
    function startAutoRotation() {
        // Clear any existing interval
        if (uiCarouselInterval) {
            clearInterval(uiCarouselInterval);
        }

        // Start carousel - change image every 10 seconds
        uiCarouselInterval = setInterval(() => {
            const nextIndex = (currentUIIndex + 1) % uiImages.length;
            goToSlide(nextIndex);
        }, 10000);
    }

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentUIIndex - 1 + uiImages.length) % uiImages.length;
            goToSlide(prevIndex);
            startAutoRotation(); // Restart timer
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentUIIndex + 1) % uiImages.length;
            goToSlide(nextIndex);
            startAutoRotation(); // Restart timer
        });
    }

    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoRotation(); // Restart timer
        });
    });

    // Start auto-rotation
    startAutoRotation();
    console.log('UI Carousel started with manual controls');
}

// Use Case Tabs
function initUseCaseTabs() {
    console.log('=== Initializing Use Case Tabs ===');

    const tabs = document.querySelectorAll('.use-case-tab');
    const contents = document.querySelectorAll('.use-case-content');

    if (!tabs || tabs.length === 0) {
        console.log('No use case tabs found, skipping initialization');
        return;
    }

    console.log('Found', tabs.length, 'use case tabs');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            console.log('Switching to tab:', tabName);

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding content
            const activeContent = document.querySelector(`[data-content="${tabName}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    console.log('Use case tabs initialized');
}

// Download form handling
function initDownloadForm() {
    const form = document.getElementById('download-form');
    const messageEl = document.getElementById('form-message');

    if (!form) {
        console.log('Download form not found, skipping initialization');
        return;
    }

    console.log('Download form initialized');

    // Load saved form data
    loadSavedFormData();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        // Get form data
        const formData = new FormData(form);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            company: formData.get('company'),
            role: formData.get('role'),
            useCase: formData.get('useCase'),
            gdprConsent: formData.get('gdprConsent') === 'on',
            newsletter: formData.get('newsletter') === 'on',
        };

        console.log('Form data:', data);

        // Show loading message
        showMessage('Submitting your request...', 'loading');

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Please wait...';

        try {
            // Call Netlify function
            const response = await fetch('/.netlify/functions/request-download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('Response:', result);

            if (response.ok) {
                // Save form data to localStorage (except GDPR consent)
                saveFormData(data);

                showMessage(
                    result.message || 'Success! Check your email for the download link.',
                    'success'
                );

                // Reset only the checkboxes, keep other fields filled
                document.getElementById('gdpr-consent').checked = false;
                document.getElementById('newsletter').checked = false;
            } else {
                showMessage(
                    result.error || 'An error occurred. Please try again.',
                    'error'
                );
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showMessage(
                'Network error. Please check your connection and try again.',
                'error'
            );
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';

        // Auto-hide after 10 seconds for success/error messages
        if (type !== 'loading') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 10000);
        }
    }
}

// Save form data to localStorage
function saveFormData(data) {
    const dataToSave = {
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        role: data.role,
        useCase: data.useCase,
        newsletter: data.newsletter
        // Note: We don't save GDPR consent - it must be checked each time
    };
    localStorage.setItem('sdiware-download-form', JSON.stringify(dataToSave));
    console.log('Form data saved to localStorage');
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('sdiware-download-form');
    if (!savedData) {
        console.log('No saved form data found');
        return;
    }

    try {
        const data = JSON.parse(savedData);
        console.log('Loading saved form data');

        // Fill in the form fields
        if (data.fullName) document.getElementById('full-name').value = data.fullName;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.company) document.getElementById('company').value = data.company;
        if (data.role) document.getElementById('role').value = data.role;
        if (data.useCase) document.getElementById('use-case').value = data.useCase;
        if (data.newsletter) document.getElementById('newsletter').checked = data.newsletter;

        console.log('Form data loaded successfully');
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

// Function to clear saved form data (optional - can be called from console if needed)
function clearSavedFormData() {
    localStorage.removeItem('sdiware-download-form');
    console.log('Saved form data cleared');
}

console.log('SDIWare website loaded successfully!');