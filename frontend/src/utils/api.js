// frontend/src/utils/api.js
// Universal Dynamic API Base & Socket URL Resolver for Localhost, LAN Mobile, and Cloud/Tunnel Deployments

export const getApiBase = () => {
    const envUrl = import.meta.env.VITE_API_URL;

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        // If accessed on mobile / LAN IP (e.g. 192.168.x.x) or ngrok tunnel:
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            // Under HTTPS (ngrok or production), always use relative /api/ to prevent Mixed Content
            if (protocol === 'https:') {
                return '/api/';
            }
            // On LAN HTTP, Vite dev server proxies /api/ -> http://localhost:5000/
            return '/api/';
        }
    }

    if (envUrl && envUrl.trim() !== '') {
        return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
    }

    return '/api/';
};

export const getSocketUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            if (protocol === 'https:') {
                return window.location.origin;
            }
            return window.location.origin;
        }
    }

    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl.startsWith('http')) {
        return envUrl.replace(/\/api\/?$/, '');
    }

    return 'http://localhost:5000';
};

export const API_BASE = getApiBase();
export const SOCKET_URL = getSocketUrl();
