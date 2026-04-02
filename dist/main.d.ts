declare const FORMSUBMIT_ENDPOINT = "37d09a1388576457258157be8924c78d";
interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}
declare function initializeContactForm(): void;
declare function initializeSmoothScroll(): void;
declare function initializePopupCardClick(): void;
interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
}
declare function detectDevice(): DeviceInfo;
declare function loadDeviceSpecificStyles(): void;
declare function setupResponsiveListener(): void;
declare function logDeviceInfo(): void;
declare function initializeLogoClick(): void;
declare function handleImageLoading(): void;
//# sourceMappingURL=main.d.ts.map