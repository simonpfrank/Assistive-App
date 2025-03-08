// State Management
const appState = {
    currentSentence: '',
    currentWord: '',
    zoomLevel: 5, // Numeric scale from 1-9 (5 = normal)
    lastError: null,
    controlsVisible: true,
    isTrackpadMode: false,
    trackpadPosition: { x: 0.5, y: 0.5 } // Normalized position (0-1)
};

// DOM Elements
const sentenceDisplay = document.getElementById('sentence-display');
const appContainer = document.getElementById('app-container');
const errorIndicator = document.getElementById('error-indicator');
const assistantControls = document.getElementById('assistant-controls');
const toggleControls = document.getElementById('toggle-controls');
const showControls = document.getElementById('show-controls');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    loadSavedState();
    
    // Initialize layout based on screen size after a short delay
    // to ensure all elements are properly rendered
    setTimeout(adjustKeyboardLayout, 500);
});

function initializeApp() {
    // Set up keyboard functionality
    setupKeyboard();

    // Set up trackpad functionality
    setupTrackpad();

    // Set up common word buttons
    setupCommonWords();

    // Set up assistant controls
    setupAssistantControls();

    // Set up keyboard navigation
    setupKeyboardNavigation();

    // Set up controls toggle
    setupControlsToggle();
}

function loadSavedState() {
    try {
        // Load zoom level from localStorage
        const savedZoom = localStorage.getItem('zoomLevel');
        if (savedZoom) {
            appState.zoomLevel = parseInt(savedZoom, 10) || 5;
            updateZoomLevel();
        }

        // Load last sentence if exists
        const savedSentence = localStorage.getItem('currentSentence');
        if (savedSentence) {
            appState.currentSentence = savedSentence;
            updateSentenceDisplay();
        }

        // Load controls visibility state
        const controlsVisible = localStorage.getItem('controlsVisible');
        if (controlsVisible !== null) {
            appState.controlsVisible = controlsVisible === 'true';
            updateControlsVisibility();
        }

        // Load input mode
        const isTrackpadMode = localStorage.getItem('isTrackpadMode');
        if (isTrackpadMode !== null) {
            appState.isTrackpadMode = isTrackpadMode === 'true';
            updateInputMode();
        }

        // Add window resize listener
        window.addEventListener('resize', function () {
            adjustKeyboardLayout();
            if (appState.isTrackpadMode) {
                updateTrackpadSize();
            }
        });
    } catch (error) {
        showError('Error loading saved state');
        console.error('Error loading saved state:', error);
    }
}

function saveState() {
    try {
        localStorage.setItem('zoomLevel', appState.zoomLevel);
        localStorage.setItem('currentSentence', appState.currentSentence);
        localStorage.setItem('controlsVisible', appState.controlsVisible);
        localStorage.setItem('isTrackpadMode', appState.isTrackpadMode);
    } catch (error) {
        showError('Error saving state');
        console.error('Error saving state:', error);
    }
}

function setupKeyboard() {
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
        // Touch support
        key.addEventListener('touchstart', function (e) {
            e.preventDefault(); // Prevent double tap zoom
            const keyValue = this.getAttribute('data-key');
            addLetterToSentence(keyValue);
            animateKeyPress(this);
        });

        // Highlight on hover (single touch simulation)
        key.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#D8E6FF'; // Highlight color
            this.style.border = '2px solid #4361EE';
        });

        key.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
            this.style.border = '';
        });

        // Double-click to add letter
        key.addEventListener('dblclick', function () {
            const keyValue = this.getAttribute('data-key');
            addLetterToSentence(keyValue);
            animateKeyPress(this);
        });

    });
}

function setupTrackpad() {
    const trackpad = document.getElementById('trackpad');
    const cursor = document.getElementById('trackpad-cursor');

    // Touch and mouse event handlers
    trackpad.addEventListener('touchstart', handleTrackpadInteraction);
    trackpad.addEventListener('touchmove', handleTrackpadInteraction);
    trackpad.addEventListener('mousedown', function (e) {
        // Register mouse movement only when mouse is down
        document.addEventListener('mousemove', handleTrackpadInteraction);
        handleTrackpadInteraction(e);
    });

    // Stop tracking mouse when released
    document.addEventListener('mouseup', function () {
        document.removeEventListener('mousemove', handleTrackpadInteraction);
    });

    // Double tap to select
    trackpad.addEventListener('dblclick', function (e) {
        selectCurrentLetter();
    });

    // Touch double tap
    let lastTap = 0;
    trackpad.addEventListener('touchend', function (e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            selectCurrentLetter();
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}

function handleTrackpadInteraction(e) {
    e.preventDefault();

    const trackpad = document.getElementById('trackpad');
    const cursor = document.getElementById('trackpad-cursor');
    const rect = trackpad.getBoundingClientRect();

    // Get position
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // Calculate normalized position (0-1)
    const normalizedX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const normalizedY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    // Update position
    appState.trackpadPosition.x = normalizedX;
    appState.trackpadPosition.y = normalizedY;

    // Update cursor position
    cursor.style.left = (normalizedX * 100) + '%';
    cursor.style.top = (normalizedY * 100) + '%';

    // Highlight nearest key
    highlightKeyFromTrackpad();
}

function highlightKeyFromTrackpad() {
    // Remove all active states
    document.querySelectorAll('.key, .word-button').forEach(el => {
        el.classList.remove('active');
    });

    if (!appState.keyMapping || appState.keyMapping.length === 0) {
        updateTrackpadMapping();
    }

    // Find the nearest key
    let closestKey = null;
    let minDistance = Infinity;

    appState.keyMapping.forEach(mapping => {
        const distance = Math.sqrt(
            Math.pow(mapping.centerX - appState.trackpadPosition.x, 2) +
            Math.pow(mapping.centerY - appState.trackpadPosition.y, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestKey = mapping.element;
        }
    });

    // Highlight the closest key
    if (closestKey) {
        closestKey.classList.add('active');
    }
}

function selectCurrentLetter() {
    const activeElement = document.querySelector('.key.active, .word-button.active');

    if (activeElement) {
        if (activeElement.classList.contains('key')) {
            const keyValue = activeElement.getAttribute('data-key');
            addLetterToSentence(keyValue);
        } else if (activeElement.classList.contains('word-button')) {
            const word = activeElement.textContent;
            addWordToSentence(word);
        }

        animateKeyPress(activeElement);
    }
}

function toggleInputMode() {
    appState.isTrackpadMode = !appState.isTrackpadMode;
    updateInputMode();
    saveState();
    
    // After mode change, adjust layout
    setTimeout(adjustKeyboardLayout, 300);
}

function updateInputMode() {
    const trackpadContainer = document.getElementById('trackpad-container');
    const modeToggleBtn = document.getElementById('btn-mode-toggle');
    const appContainer = document.getElementById('app-container');

    if (appState.isTrackpadMode) {
        trackpadContainer.classList.remove('hidden');
        modeToggleBtn.textContent = 'Hide Trackpad';
        appContainer.classList.add('trackpad-mode');
        updateZoomLevel();
        updateTrackpadSize();
    } else {
        trackpadContainer.classList.add('hidden');
        modeToggleBtn.textContent = 'Show Trackpad';
        appContainer.classList.remove('trackpad-mode');
    }
}

function updateTrackpadSize() {
    if (!appState.isTrackpadMode) return;

    // Use relative scaling based on zoom level
    const scaleFactor = 0.4 + (appState.zoomLevel - 1) * 0.075;
    
    const trackpadContainer = document.getElementById('trackpad-container');
    const trackpad = document.getElementById('trackpad');
    const cursor = document.getElementById('trackpad-cursor');
    const hintH = document.getElementById('trackpad-hint-horizontal');
    const hintV = document.getElementById('trackpad-hint-vertical');
    
    // Calculate height based on zoom level
    const containerHeight = 15 + (appState.zoomLevel - 1) * 2;
    trackpadContainer.style.height = `${containerHeight}vh`;
    
    // Trackpad elements scaling
    cursor.style.width = `${20 * scaleFactor}px`;
    cursor.style.height = `${20 * scaleFactor}px`;
    hintH.style.height = `${2 * scaleFactor}px`;
    hintV.style.width = `${2 * scaleFactor}px`;
    
    // Update the mapping array for trackpad-to-keyboard mapping
    updateTrackpadMapping();
}

function updateTrackpadMapping() {
    // Create a mapping of normalized trackpad positions to keys
    appState.keyMapping = [];

    // Get all keys including common word buttons
    const keys = [
        ...Array.from(document.querySelectorAll('.key')),
        ...Array.from(document.querySelectorAll('.word-button'))
    ];

    keys.forEach(key => {
        const rect = key.getBoundingClientRect();
        const trackpad = document.getElementById('trackpad');
        const trackpadRect = trackpad.getBoundingClientRect();

        // Store relative position and element
        appState.keyMapping.push({
            element: key,
            centerX: (rect.left + rect.width / 2 - trackpadRect.left) / trackpadRect.width,
            centerY: (rect.top + rect.height / 2 - trackpadRect.top) / trackpadRect.height,
            width: rect.width / trackpadRect.width,
            height: rect.height / trackpadRect.height
        });
    });
}

function setupCommonWords() {
    const wordButtons = document.querySelectorAll('.word-button');

    wordButtons.forEach(button => {
        // Touch support
        button.addEventListener('touchstart', function (e) {
            e.preventDefault(); // Prevent double tap zoom
            const word = this.textContent;
            addWordToSentence(word);
            animateKeyPress(this);
        });

        // Highlight on hover
        button.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#D8E6FF'; // Highlight color
            this.style.border = '2px solid #4361EE';
        });

        button.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
            this.style.border = '';
        });

        // Double-click to add word
        button.addEventListener('dblclick', function () {
            const word = this.textContent;
            addWordToSentence(word);
            animateKeyPress(this);
        });
    });
}

function setupAssistantControls() {
    // Clear button
    document.getElementById('btn-clear').addEventListener('click', function () {
        clearSentence();
    });

    // Delete button
    document.getElementById('btn-delete').addEventListener('click', function () {
        deleteLastCharacter();
    });

    // Speak button
    document.getElementById('btn-speak').addEventListener('click', function () {
        speakSentence();
    });

    // Zoom controls
    document.getElementById('btn-zoom-in').addEventListener('click', function () {
        zoomIn();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', function () {
        zoomOut();
    });

    // Mode toggle button
    document.getElementById('btn-mode-toggle').addEventListener('click', function () {
        toggleInputMode();
    });
}

function setupControlsToggle() {
    toggleControls.addEventListener('click', function () {
        appState.controlsVisible = false;
        updateControlsVisibility();
        saveState();
    });

    showControls.addEventListener('click', function () {
        appState.controlsVisible = true;
        updateControlsVisibility();
        saveState();
    });
}

function updateControlsVisibility() {
    if (appState.controlsVisible) {
        assistantControls.classList.remove('hidden');
        showControls.style.display = 'none';
        toggleControls.textContent = '▲';
        sentenceDisplay.style.marginTop = '10px';
    } else {
        assistantControls.classList.add('hidden');
        showControls.style.display = 'flex';
        toggleControls.textContent = '▼';
        sentenceDisplay.style.marginTop = '40px';
    }
    
    // After changing visibility, update layout to adjust
    setTimeout(() => {
        adjustKeyboardLayout();
    }, 300); // Wait for transition to complete
}

function setupKeyboardNavigation() {
    // Handle physical keyboard input
    document.addEventListener('keydown', function (e) {
        // Get the pressed key
        const key = e.key.toUpperCase();

        // Check if it's a letter, space, or period
        if (/^[A-Z]$/.test(key) || key === ' ' || key === '.') {
            // Find and activate the corresponding on-screen key
            const onScreenKey = document.querySelector(`.key[data-key="${key === ' ' ? ' ' : key}"]`);
            if (onScreenKey) {
                addLetterToSentence(key === ' ' ? ' ' : key);
                animateKeyPress(onScreenKey);
            }
        } else if (key === 'BACKSPACE') {
            deleteLastCharacter();
            animateKeyPress(document.getElementById('btn-delete'));
        } else if (key === 'ENTER') {
            addLetterToSentence(' ');
            animateKeyPress(document.querySelector('.key.space'));
        }
    });
}

function addLetterToSentence(letter) {
    appState.currentSentence += letter;
    updateSentenceDisplay();
    saveState();
}

function addWordToSentence(word) {
    // Check if we need to add a space before the word
    if (appState.currentSentence.length > 0 &&
        !appState.currentSentence.endsWith(' ')) {
        appState.currentSentence += ' ';
    }

    appState.currentSentence += word;

    // Add a space after the word
    appState.currentSentence += ' ';

    updateSentenceDisplay();
    saveState();
}

function deleteLastCharacter() {
    if (appState.currentSentence.length > 0) {
        appState.currentSentence = appState.currentSentence.slice(0, -1);
        updateSentenceDisplay();
        saveState();
    }
}

function clearSentence() {
    appState.currentSentence = '';
    updateSentenceDisplay();
    saveState();
}

function updateSentenceDisplay() {
    sentenceDisplay.textContent = appState.currentSentence;
    // Auto-scroll to bottom if content overflows
    sentenceDisplay.scrollTop = sentenceDisplay.scrollHeight;
}

function speakSentence() {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(appState.currentSentence);
            utterance.lang = 'en-GB'; // UK English
            window.speechSynthesis.speak(utterance);
        } else {
            showError('Speech synthesis not supported');
        }
    } catch (error) {
        showError('Error with speech synthesis');
        console.error('Speech synthesis error:', error);
    }
}

function zoomIn() {
    if (appState.zoomLevel < 9) {
        appState.zoomLevel++;
        updateZoomLevel();
        saveState();
    }
}

function zoomOut() {
    if (appState.zoomLevel > 1) {
        appState.zoomLevel--;
        updateZoomLevel();
        saveState();
    }
}

function updateZoomLevel() {
    // Calculate base scaling factor from zoom level (1-9 range, 5 is normal)
    // For zoom level 5 (normal), scale = 1.0
    // For zoom level 1 (smallest), scale = 0.6
    // For zoom level 9 (largest), scale = 1.4
    const scale = 0.6 + (appState.zoomLevel - 1) * 0.1;
    
    // Get the keyboard wrapper element
    const keyboardWrapper = document.getElementById('keyboard-wrapper');
    
    // Apply scaling to the wrapper
    keyboardWrapper.style.transform = `scale(${scale})`;
    
    // Scale from bottom center to maintain docking
    keyboardWrapper.style.transformOrigin = 'center bottom';
    
    // Make sure keys scale properly
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        // Set font size proportional to scale
        key.style.fontSize = `${Math.max(0.8, 1.2 * scale)}rem`;
    });
    
    // Make sure common words scale properly
    const wordButtons = document.querySelectorAll('.word-button');
    wordButtons.forEach(button => {
        button.style.fontSize = `${Math.max(0.8, 1 * scale)}rem`;
        button.style.padding = `${Math.max(5, 10 * scale)}px ${Math.max(10, 15 * scale)}px`;
    });
    
    // If in trackpad mode, update trackpad size as well
    if (appState.isTrackpadMode) {
        updateTrackpadSize();
    }
    
    console.log(`Zoom level: ${appState.zoomLevel}, Scale: ${scale}`);
}

function adjustKeyboardLayout() {
    const assistantControls = document.getElementById('assistant-controls');
    const keyboardContainer = document.getElementById('keyboard-container');
    const keyboardWrapper = document.getElementById('keyboard-wrapper');
    const commonWords = document.getElementById('common-words');
    
    // Reset any inline styles for common words
    commonWords.style.flexWrap = '';
    
    // For smaller screens, wrap common words
    if (window.innerWidth < 768) {
        commonWords.style.flexWrap = 'wrap';
    }
    
    // Calculate available height
    const windowHeight = window.innerHeight;
    const controlsHeight = assistantControls.classList.contains('hidden') ? 0 : assistantControls.offsetHeight;
    const sentenceHeight = document.getElementById('sentence-display').offsetHeight;
    const availableHeight = windowHeight - controlsHeight - sentenceHeight - 40; // 40px for margins
    
    // Adjust keyboard container based on available space
    keyboardContainer.style.height = `${availableHeight}px`;
    
    // Ensure wrapper is properly positioned at the bottom
    keyboardWrapper.style.marginTop = 'auto';
    
    // Debug info
    console.log(`Window height: ${windowHeight}px`);
    console.log(`Available height: ${availableHeight}px`);
    console.log(`Controls visible: ${!assistantControls.classList.contains('hidden')}`);
    
    // Update zoom to respect new container size
    updateZoomLevel();
}

function animateKeyPress(element) {
    // Add active class
    element.classList.add('active');

    // Remove after animation completes
    setTimeout(() => {
        element.classList.remove('active');
    }, 200);
}

function showError(message) {
    appState.lastError = message;

    // Show error indicator
    errorIndicator.style.display = 'block';

    // Log error to console
    console.error('App Error:', message);

    // Hide after 3 seconds
    setTimeout(() => {
        errorIndicator.style.display = 'none';
    }, 3000);
}

// Function to reset app to default state (for console use)
function resetAppState() {
    // Clear localStorage
    localStorage.removeItem('zoomLevel');
    localStorage.removeItem('currentSentence');
    localStorage.removeItem('controlsVisible');
    localStorage.removeItem('isTrackpadMode');
    
    // Reset appState to defaults
    appState.zoomLevel = 5; // Default zoom level
    appState.currentSentence = '';
    appState.controlsVisible = true;
    appState.isTrackpadMode = false;
    
    // Apply the reset values to UI
    updateZoomLevel();
    updateSentenceDisplay();
    updateControlsVisibility();
    updateInputMode();

    // Reset keyboard wrapper transform
    const keyboardWrapper = document.getElementById('keyboard-wrapper');
    keyboardWrapper.style.transform = 'scale(1)';
    
    console.log('App state has been reset to defaults.');
}

// Alternative simpler approach: just clear localStorage and reload
function quickReset() {
    localStorage.clear();
    window.location.reload();
    // This will force the app to reload with default settings
}
