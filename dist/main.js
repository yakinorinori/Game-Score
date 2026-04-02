"use strict";
const FORMSUBMIT_ENDPOINT = '37d09a1388576457258157be8924c78d';
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form)
        return;
    form.addEventListener('submit', (event) => {
        const formData = getFormData(form);
        if (!validateForm(formData)) {
            event.preventDefault();
        }
    });
    function getFormData(form) {
        return {
            name: form.elements.namedItem('name').value,
            email: form.elements.namedItem('email').value,
            phone: form.elements.namedItem('phone').value,
            subject: form.elements.namedItem('subject').value,
            message: form.elements.namedItem('message').value,
        };
    }
    function validateForm(data) {
        if (!data.name.trim()) {
            alert('お名前を入力してください。');
            return false;
        }
        if (!data.email.trim() || !isValidEmail(data.email)) {
            alert('有効なメールアドレスを入力してください。');
            return false;
        }
        if (!data.subject.trim()) {
            alert('件名を入力してください。');
            return false;
        }
        if (!data.message.trim()) {
            alert('お問い合わせ内容を入力してください。');
            return false;
        }
        return true;
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                event.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}
function initializePopupCardClick() {
    const serviceMap = {
        0: '#service-sales',
        1: '#service-consulting',
        2: '#service-transportation',
        3: '#service-real_estate',
    };
    document.querySelectorAll('.popup-card').forEach((card, index) => {
        const popupCard = card;
        popupCard.style.cursor = 'pointer';
        popupCard.addEventListener('click', () => {
            const targetId = serviceMap[index];
            if (targetId) {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        popupCard.addEventListener('mouseenter', () => {
            popupCard.style.transform = 'scale(1.05)';
        });
        popupCard.addEventListener('mouseleave', () => {
            popupCard.style.transform = 'scale(1)';
        });
    });
}
function detectDevice() {
    const width = window.innerWidth;
    return {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
    };
}
function loadDeviceSpecificStyles() {
    const device = detectDevice();
    const head = document.head;
    const existingMobileLink = document.getElementById('mobile-stylesheet');
    if (device.isMobile) {
        if (!existingMobileLink) {
            const link = document.createElement('link');
            link.id = 'mobile-stylesheet';
            link.rel = 'stylesheet';
            link.href = 'css/style-mobile.css';
            head.appendChild(link);
            console.log('Mobile stylesheet loaded:', device.width + 'px');
        }
    }
    else {
        if (existingMobileLink) {
            existingMobileLink.remove();
            console.log('Mobile stylesheet removed:', device.width + 'px');
        }
    }
}
function setupResponsiveListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
            loadDeviceSpecificStyles();
            console.log('Device detection updated on resize');
        }, 250);
    });
}
function logDeviceInfo() {
    const device = detectDevice();
    console.log('Device Info:', {
        isMobile: device.isMobile,
        isTablet: device.isTablet,
        isDesktop: device.isDesktop,
        width: device.width + 'px',
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadDeviceSpecificStyles();
    setupResponsiveListener();
    logDeviceInfo();
    initializeContactForm();
    initializeSmoothScroll();
    initializePopupCardClick();
    console.log('Company website initialized');
});
//# sourceMappingURL=main.js.map