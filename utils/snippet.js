/**
 * Utility for Issue #23: Shareable Snippet Links
 * Encodes and decodes external URLs into URL-safe Base64 strings.
 */

/**
 * Encodes a URL into a URL-safe Base64 string
 * @param {string} url - The raw Gist or GitHub raw URL
 * @returns {string} - The encoded snippet hash
 */
export function encodeSnippet(url) {
    if (!url) return "";
    
    try {
        // 1. Standard Base64 encoding
        const base64 = window.btoa(url);
        
        // 2. Make it URL-safe: 
        // Replace '+' with '-', '/' with '_', and remove trailing '='
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    } catch (e) {
        console.error("[Snippet] Encoding failed:", e);
        return "";
    }
}

/**
 * Decodes a URL-safe Base64 string back into the original URL
 * @param {string} hash - The encoded string from the URL path
 * @returns {string} - The decoded download URL
 */
export function decodeSnippet(hash) {
    if (!hash) return "";

    try {
        // 1. Reverse the URL-safe replacements
        let base64 = hash
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        // 2. Restore padding '=' if necessary
        while (base64.length % 4) {
            base64 += '=';
        }

        // 3. Standard Base64 decoding
        return window.atob(base64);
    } catch (e) {
        console.error("[Snippet] Decoding failed:", e);
        return "";
    }
}