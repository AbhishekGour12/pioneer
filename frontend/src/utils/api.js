// frontend/src/utils/api.js
// Universal Dynamic API Base & Socket URL Resolver for Localhost, Vercel Production, and Render Cloud Backend

export const RENDER_BACKEND_URL = 'https://pioneer-gvve.onrender.com';
export const VERCEL_FRONTEND_URL = 'https://playpeak.vercel.app';

export const getApiBase = () => {
    // 1. If explicit env variable is provided:
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl.startsWith('http')) {
        return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
    }

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // If explicitly hosted on Vercel or custom public production domain:
        if (hostname.includes('vercel.app')) {
            return `${RENDER_BACKEND_URL}/api/`;
        }

        // On local dev machine OR local mobile device on same Wi-Fi (localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, *.local, *.ngrok-free.dev):
        // Relative /api/ is intercepted by Vite dev server and proxied to local backend (port 5000)
        return '/api/';
    }

    return '/api/';
};

export const getSocketUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('vercel.app')) {
            return RENDER_BACKEND_URL;
        }
        // Local machine or LAN: point to current host's backend port (5000) or current origin (proxied)
        return `http://${hostname}:5000`;
    }

    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl.startsWith('http')) {
        return envUrl.replace(/\/api\/?$/, '');
    }

    return 'http://localhost:5000';
};

import axios from 'axios';

export const API_BASE = getApiBase();
export const SOCKET_URL = getSocketUrl();

/**
 * Upload athlete student photo to Cloudflare R2 storage via backend
 * @param {File|Blob|string} fileOrBase64 
 * @returns {Promise<{ url: string, key: string, storage: string }>}
 */
export const uploadAthletePhoto = async (fileOrBase64) => {
    const base = getApiBase();
    let res;
    if (typeof fileOrBase64 === 'string') {
        res = await axios.post(`${base}upload`, { base64: fileOrBase64 });
    } else {
        const formData = new FormData();
        formData.append('photo', fileOrBase64);
        res = await axios.post(`${base}upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return res.data;
};

/**
 * Delete athlete photo from Cloudflare R2 / storage
 * @param {string} keyOrUrl
 */
export const deleteAthletePhoto = async (keyOrUrl) => {
    if (!keyOrUrl) return null;
    const base = getApiBase();
    const res = await axios.post(`${base}upload/delete`, { url: keyOrUrl, key: keyOrUrl });
    return res.data;
};
