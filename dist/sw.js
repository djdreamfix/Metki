// Placeholder service worker. Currently does nothing but required for PWA installability.
self.addEventListener('install', (event) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim clients immediately so that the service worker controls the page
  event.waitUntil(self.clients.claim());
});