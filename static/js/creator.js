// ==================== DYNAMIC THEME SYSTEM ====================
const themes = [
    {
        name: 'Pink Dreams',
        primary: '#ff6b9d',
        secondary: '#ffd60a',
        tertiary: '#00d9ff',
        bgPrimary: '#0a0e27',
        bgSecondary: '#1a1f3a',
        gradient: 'linear-gradient(135deg, #ff6b9d 0%, #ffd60a 100%)'
    },
    {
        name: 'Purple Haze',
        primary: '#a78bfa',
        secondary: '#ec4899',
        tertiary: '#06b6d4',
        bgPrimary: '#0f0a1e',
        bgSecondary: '#1e1533',
        gradient: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)'
    },
    {
        name: 'Ocean Breeze',
        primary: '#06b6d4',
        secondary: '#3b82f6',
        tertiary: '#8b5cf6',
        bgPrimary: '#0a1628',
        bgSecondary: '#152238',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
    },
    {
        name: 'Sunset Glow',
        primary: '#f59e0b',
        secondary: '#ef4444',
        tertiary: '#ec4899',
        bgPrimary: '#1a0f0a',
        bgSecondary: '#2d1810',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
    },
    {
        name: 'Emerald Forest',
        primary: '#10b981',
        secondary: '#06b6d4',
        tertiary: '#8b5cf6',
        bgPrimary: '#0a1e15',
        bgSecondary: '#132d23',
        gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
    },
    {
        name: 'Midnight Magic',
        primary: '#8b5cf6',
        secondary: '#6366f1',
        tertiary: '#ec4899',
        bgPrimary: '#0f0a1e',
        bgSecondary: '#1a1333',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
    },
    {
        name: 'Coral Reef',
        primary: '#fb7185',
        secondary: '#fbbf24',
        tertiary: '#34d399',
        bgPrimary: '#1e0a14',
        bgSecondary: '#2d1522',
        gradient: 'linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)'
    },
    {
        name: 'Northern Lights',
        primary: '#34d399',
        secondary: '#60a5fa',
        tertiary: '#a78bfa',
        bgPrimary: '#0a1e1a',
        bgSecondary: '#142d28',
        gradient: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)'
    }
];

function applyRandomTheme() {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const root = document.documentElement;
    
    root.style.setProperty('--accent-primary', theme.primary);
    root.style.setProperty('--accent-secondary', theme.secondary);
    root.style.setProperty('--accent-tertiary', theme.tertiary);
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--gradient-primary', theme.gradient);
    root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${theme.tertiary} 0%, ${theme.primary} 100%)`);
    root.style.setProperty('--shadow-glow', `0 0 20px ${theme.primary}40`);
    
    // Update theme badge
    setTimeout(() => {
        const themeBadge = document.getElementById('themeBadge');
        if (themeBadge) {
            themeBadge.textContent = `🎨 ${theme.name}`;
            themeBadge.title = 'Click to change theme';
            themeBadge.style.cursor = 'pointer';
        }
    }, 100);
    
    console.log(`🎨 Theme applied: ${theme.name}`);
    return theme;
}

// Apply theme on page load
const currentTheme = applyRandomTheme();

// Add click handler to theme badge for manual theme changes
document.addEventListener('DOMContentLoaded', () => {
    const themeBadge = document.getElementById('themeBadge');
    if (themeBadge) {
        themeBadge.addEventListener('click', () => {
            playHaptic('light');
            playSound('click');
            applyRandomTheme();
        });
    }
});

// ==================== DOM ELEMENTS ====================
const messageForm = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const targetName = document.getElementById('targetName');
const charCount = document.getElementById('charCount');
const charFill = document.getElementById('charFill');
const toggleCustomization = document.getElementById('toggleCustomization');
const customizationOptions = document.getElementById('customizationOptions');
const previewBtn = document.getElementById('previewBtn');
const previewModal = document.getElementById('previewModal');
const previewMessageOverlay = document.getElementById('previewMessageOverlay');
const previewContainerOverlay = document.getElementById('previewContainerOverlay');
const successModal = document.getElementById('successModal');
const shareLink = document.getElementById('shareLink');
const createBtn = document.getElementById('createBtn');
const toast = document.getElementById('toast');

// Form inputs
const inputs = {
    primaryColor: document.getElementById('primaryColor'),
    secondaryColor: document.getElementById('secondaryColor'),
    backgroundColor: document.getElementById('backgroundColor'),
    emojis: document.getElementById('emojis'),
    transitionType: document.getElementById('transitionType'),
    animationDuration: document.getElementById('animationDuration'),
    fontFamily: document.getElementById('fontFamily'),
    fontSize: document.getElementById('fontSize'),
    backgroundEffect: document.getElementById('backgroundEffect'),
    effectType: document.getElementById('effectType'),
};

// ==================== HAPTIC & AUDIO FEEDBACK ====================
function playHaptic(intensity = 'medium') {
    if (navigator.vibrate) {
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 40,
        };
        navigator.vibrate(patterns[intensity] || 20);
    }
}

function playSound(type = 'click') {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;

        case 'success':
            oscillator.frequency.value = 1000;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;

        case 'copy':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
    }
}

function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, duration);
}

// ==================== CHARACTER COUNT ====================
const romanticWords = [
    'love', 'beloved', 'sweetheart', 'darling', 'honey', 'babe', 'cute', 'beautiful', 'handsome',
    'gorgeous', 'crush', 'adore', 'romance', 'romantic', 'kiss', 'hug', 'cuddle', 'heart',
    'valentine', 'forever', 'always', 'together', 'soulmate', 'destiny', 'passion', 'affection',
    'amour', 'enchanted', 'dreamy', 'divine', 'angel', 'precious', 'treasure', 'care', 'adoration',
    'infatuation', 'tenderness', 'devoted', 'intimate', 'sentimental', 'yearning', 'admire',
    'enamored', 'besotted', 'lovestruck', 'cherish', 'fond', 'doting', 'captivated', 'enchant',
    'fascinated', 'mesmerized', 'attracted', 'allure', 'charm', 'captivate', 'devotion',
    'bond', 'connection', 'intimate', 'affectionate', 'caring', 'compassionate', 'tender'
];

function createLoveConfetti() {
    const loveEmojis = ['❤️', '💕', '💖', '💗', '💝', '✨', '💫', '🌹', '😍', '💌'];
    
    for (let i = 0; i < 8; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'love-confetti';
        confetti.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.position = 'absolute';
        confetti.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        confetti.style.opacity = '1';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `fallConfetti ${Math.random() * 1 + 2}s ease-in forwards`;
        confetti.style.zIndex = '100';
        
        // Append to a container near the textarea
        const container = messageText.parentElement;
        container.style.position = 'relative';
        container.style.overflow = 'visible';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function checkForLoveWords(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    for (let word of words) {
        // Remove punctuation for matching
        const cleanWord = word.replace(/[^a-z]/g, '');
        
        if (romanticWords.includes(cleanWord)) {
            return true;
        }
    }
    return false;
}

let lastLoveConfettiTime = 0;

messageText.addEventListener('input', () => {
    const length = messageText.value.length;
    const percentage = (length / 500) * 100;
    charCount.textContent = `${length}/500`;
    charFill.style.width = percentage + '%';
    
    // Check for love words and trigger confetti
    const now = Date.now();
    if (now - lastLoveConfettiTime > 800) { // Throttle to once per 800ms
        if (checkForLoveWords(messageText.value)) {
            createLoveConfetti();
            playHaptic('light');
            lastLoveConfettiTime = now;
        }
    }
});

// ==================== FORM INTERACTIONS ====================
messageText.addEventListener('focus', () => {
    playHaptic('light');
});

messageText.addEventListener('input', () => {
    if (messageText.value.length % 50 === 0 && messageText.value.length > 0) {
        playSound('click');
    }
});

// ==================== CUSTOMIZATION TOGGLE ====================
toggleCustomization.addEventListener('click', (e) => {
    e.preventDefault();
    playHaptic('medium');
    playSound('click');
    
    const isActive = customizationOptions.classList.contains('active');
    customizationOptions.classList.toggle('active');
    toggleCustomization.classList.toggle('active');
    
    if (!isActive) {
        showToast('Customization options unlocked ✨');
    }
});

// ==================== PREVIEW OVERLAY ====================
function updatePreviewOverlay() {
    if (!messageText.value) {
        previewMessageOverlay.innerHTML = '<p class="preview-message-empty">Your message will appear here...</p>';
        return;
    }

    const fontSize = inputs.fontSize.value;
    const fontFamily = inputs.fontFamily.value;
    const primaryColor = inputs.primaryColor.value;
    const secondaryColor = inputs.secondaryColor.value;
    const bgColor = inputs.backgroundColor.value;
    const emojis = inputs.emojis.value.split(',').map(e => e.trim()).join(' ');
    const effectType = inputs.effectType.value;

    let textStyle = `
        color: ${primaryColor};
        font-family: '${fontFamily}', sans-serif;
        font-size: ${fontSize * 0.4}px;
        font-weight: 500;
        margin-bottom: 20px;
        word-wrap: break-word;
        line-height: 1.6;
    `;

    // Add effects
    if (effectType === 'glow') {
        textStyle += `text-shadow: 0 0 20px ${primaryColor}80;`;
    } else if (effectType === 'blur') {
        textStyle += `filter: blur(0.5px);`;
    } else if (effectType === 'shadow') {
        textStyle += `text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);`;
    }

    previewMessageOverlay.innerHTML = `
        <p style="${textStyle}">${messageText.value}</p>
        <div style="font-size: 30px; animation: float 3s ease-in-out infinite;">${emojis}</div>
    `;

    // Update background
    previewContainerOverlay.style.background = `linear-gradient(135deg, ${bgColor}, ${secondaryColor}30)`;
}

function openPreviewModal() {
    updatePreviewOverlay();
    previewModal.classList.add('active');
    playHaptic('medium');
    playSound('click');
}

function closePreviewModal() {
    previewModal.classList.remove('active');
}

if (previewBtn) {
    previewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPreviewModal();
    });
}

// ==================== FORM SUBMISSION ====================
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    playHaptic('heavy');
    playSound('success');

    // Validate
    if (!messageText.value.trim()) {
        showToast('Please enter a message');
        playHaptic('light');
        return;
    }

    // Show loading state
    createBtn.disabled = true;
    createBtn.innerHTML = '<span class="spinner"></span> Creating...';
    createBtn.classList.add('btn-loading');

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: messageText.value,
                targetName: targetName.value.trim() || 'Special Someone',
                primaryColor: inputs.primaryColor.value,
                secondaryColor: inputs.secondaryColor.value,
                backgroundColor: inputs.backgroundColor.value,
                emojis: inputs.emojis.value.split(',').map(e => e.trim()),
                transitionType: inputs.transitionType.value,
                animationDuration: parseInt(inputs.animationDuration.value),
                fontFamily: inputs.fontFamily.value,
                fontSize: parseInt(inputs.fontSize.value),
                backgroundEffect: inputs.backgroundEffect.value,
                effectType: inputs.effectType.value,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.errors?.join(', ') || 'Failed to create message');
        }

        const data = await response.json();

        // Show success modal
        shareLink.value = data.shareUrl;
        successModal.classList.add('active');
        showToast('Message created successfully! 🎉');

        // Reset form
        messageForm.reset();
        charCount.textContent = '0/500';
        charFill.style.width = '0%';
        customizationOptions.classList.remove('active');
        toggleCustomization.classList.remove('active');

    } catch (error) {
        showToast(`Error: ${error.message}`);
        playHaptic('light');
    } finally {
        createBtn.disabled = false;
        createBtn.innerHTML = 'Create & Share 🚀';
        createBtn.classList.remove('btn-loading');
    }
});

// ==================== MODAL FUNCTIONS ====================
function closeModal() {
    playHaptic('medium');
    playSound('click');
    successModal.classList.remove('active');
}

function copyToClipboard() {
    playHaptic('medium');
    playSound('copy');
    
    shareLink.select();
    document.execCommand('copy');
    
    showToast('Link copied! 📋');
}

// ==================== SOCIAL SHARING ====================
function shareOnWhatsApp() {
    playHaptic('light');
    const url = shareLink.value;
    const text = encodeURIComponent(`Check out this beautiful message! 💕\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnTwitter() {
    playHaptic('light');
    const url = shareLink.value;
    const text = encodeURIComponent(`I just created a beautiful message with Blushy 🤭\n\n${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareOnFacebook() {
    playHaptic('light');
    const url = shareLink.value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

// ==================== CLOSE MODAL ON OUTSIDE CLICK ====================
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
    if (e.target === previewModal) {
        closePreviewModal();
    }
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === messageText) {
            messageForm.dispatchEvent(new Event('submit'));
        }
    }
});

// ==================== ACCESSIBILITY & UX ====================
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add focus visible styles for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    // Show toast on page load
    showToast('Welcome to Blushy! 🤭', 2000);
});
