// メインアプリケーションのTypeScriptコード

/**
 * ★★★ ここでFormSubmitエンドポイントを設定 ★★★
 * クライアントごとに変更してください
 * index.htmlの form action属性と同じ値にしてください
 */
const FORMSUBMIT_ENDPOINT = '37d09a1388576457258157be8924c78d';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

/**
 * お問い合わせフォームの初期化
 */
function initializeContactForm(): void {
    const form = document.querySelector('.contact-form') as HTMLFormElement;

    if (!form) return;

    // FormSubmitへの送信前バリデーション
    form.addEventListener('submit', (event: Event) => {
        const formData = getFormData(form);

        if (!validateForm(formData)) {
            event.preventDefault();
        }
    });

    /**
     * フォームデータを取得
     */
    function getFormData(form: HTMLFormElement): ContactFormData {
        return {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };
    }

    /**
     * フォーム入力値の検証
     */
    function validateForm(data: ContactFormData): boolean {
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

    /**
     * メールアドレスの形式を検証
     */
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * スムーズスクロール機能
 */
function initializeSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
        anchor.addEventListener('click', function (this: HTMLAnchorElement, event: Event) {
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

/**
 * ビジネスポップアップカードのクリック機能
 */
function initializePopupCardClick(): void {
    const serviceMap: { [key: number]: string } = {
        0: '#service-sales',
        1: '#service-consulting',
        2: '#service-transportation',
        3: '#service-real_estate',
    };

    document.querySelectorAll('.popup-card').forEach((card: Element, index: number) => {
        const popupCard = card as HTMLElement;
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

        // ホバー効果を追加
        popupCard.addEventListener('mouseenter', () => {
            popupCard.style.transform = 'scale(1.05)';
        });

        popupCard.addEventListener('mouseleave', () => {
            popupCard.style.transform = 'scale(1)';
        });
    });
}

/**
 * デバイスタイプを判定
 */
interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
}

function detectDevice(): DeviceInfo {
    const width = window.innerWidth;
    return {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
    };
}

/**
 * デバイスに応じてスタイルシートを動的に読み込む
 */
function loadDeviceSpecificStyles(): void {
    const device = detectDevice();
    const head = document.head;
    
    // 既存のモバイルスタイルシートを確認
    const existingMobileLink = document.getElementById('mobile-stylesheet');
    
    if (device.isMobile) {
        // スマートフォンの場合、モバイル専用CSSを読み込む
        if (!existingMobileLink) {
            const link = document.createElement('link');
            link.id = 'mobile-stylesheet';
            link.rel = 'stylesheet';
            link.href = 'css/style-mobile.css';
            head.appendChild(link);
            console.log('Mobile stylesheet loaded:', device.width + 'px');
        }
    } else {
        // デスクトップ/タブレットの場合、モバイルCSSを削除
        if (existingMobileLink) {
            existingMobileLink.remove();
            console.log('Mobile stylesheet removed:', device.width + 'px');
        }
    }
}

/**
 * ウィンドウリサイズ時にデバイス判定を再実行
 */
function setupResponsiveListener(): void {
    let resizeTimeout: number;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
            loadDeviceSpecificStyles();
            console.log('Device detection updated on resize');
        }, 250);
    });
}

/**
 * デバイス情報をコンソールに出力（デバッグ用）
 */
function logDeviceInfo(): void {
    const device = detectDevice();
    console.log('Device Info:', {
        isMobile: device.isMobile,
        isTablet: device.isTablet,
        isDesktop: device.isDesktop,
        width: device.width + 'px',
    });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    // デバイス検出とスタイル読み込み
    loadDeviceSpecificStyles();
    setupResponsiveListener();
    logDeviceInfo();
    
    // 既存の初期化
    initializeContactForm();
    initializeSmoothScroll();
    initializePopupCardClick();
    
    // 画像読み込み完了時のアニメーション削除
    handleImageLoading();
    
    // ロゴクリック時のスクロール処理
    initializeLogoClick();
    
    console.log('Company website initialized');
});

/**
 * ロゴクリック時にページトップへスクロール
 */
function initializeLogoClick(): void {
    const logo = document.getElementById('logo-to-top');
    
    if (logo) {
        logo.addEventListener('click', (event: Event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 画像読み込み完了時のアニメーション処理
 */
function handleImageLoading(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach((img: HTMLImageElement) => {
        // 既にキャッシュから読み込まれている場合
        if (img.complete) {
            img.style.animation = 'none';
            img.style.background = 'none';
        }
        
        // 読み込み完了時
        img.addEventListener('load', () => {
            img.style.animation = 'none';
            img.style.background = 'none';
        });
        
        // エラー時もアニメーション削除
        img.addEventListener('error', () => {
            img.style.animation = 'none';
            img.style.background = 'none';
        });
    });
}
