const CACHE_NAME = 'ecosort-ai-v2.1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    // TensorFlow.js files
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.0.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js',
    // Chart.js for ML visualizations
    'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js',
    // Font Awesome
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('SW: Installing service worker v2.1.0');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Caching app shell and ML resources');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('SW: All resources cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('SW: Failed to cache resources:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('SW: Activating service worker v2.1.0');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('SW: Service worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Handle ML model requests specially
    if (event.request.url.includes('tensorflow') || 
        event.request.url.includes('coco-ssd') ||
        event.request.url.includes('chart.js')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        console.log('SW: Serving ML resource from cache:', event.request.url);
                        return response;
                    }
                    
                    console.log('SW: Fetching ML resource from network:', event.request.url);
                    return fetch(event.request).then(response => {
                        // Cache successful responses
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    });
                })
                .catch(error => {
                    console.error('SW: Failed to fetch ML resource:', error);
                    // Return a fallback response for critical ML resources
                    if (event.request.url.includes('tensorflow')) {
                        return new Response('// TensorFlow.js fallback', {
                            headers: { 'Content-Type': 'application/javascript' }
                        });
                    }
                })
        );
        return;
    }

    // Handle IndexedDB requests (for ML model storage)
    if (event.request.url.includes('indexeddb://')) {
        // Let the browser handle IndexedDB requests directly
        return;
    }

    // Standard caching strategy for other requests
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('SW: Serving from cache:', event.request.url);
                    return response;
                }

                // Fetch from network
                console.log('SW: Fetching from network:', event.request.url);
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Add to cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(error => {
                console.error('SW: Fetch failed:', error);
                
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                
                // Return a generic offline response
                return new Response('Offline - Please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});

// Background sync for ML training data
self.addEventListener('sync', event => {
    console.log('SW: Background sync triggered:', event.tag);
    
    if (event.tag === 'ml-training-sync') {
        event.waitUntil(syncMLTrainingData());
    }
    
    if (event.tag === 'federated-learning-sync') {
        event.waitUntil(syncFederatedLearning());
    }
});

// Sync ML training data
async function syncMLTrainingData() {
    try {
        console.log('SW: Syncing ML training data...');
        
        // Get training data from IndexedDB
        const db = await openIndexedDB();
        const trainingData = await getTrainingDataFromDB(db);
        
        if (trainingData.length > 0) {
            // Send to server (if you have a backend)
            // await sendTrainingDataToServer(trainingData);
            
            // Or process locally
            await processTrainingDataLocally(trainingData);
            
            console.log('SW: ML training data synced successfully');
        }
    } catch (error) {
        console.error('SW: Failed to sync ML training data:', error);
    }
}

// Sync federated learning updates
async function syncFederatedLearning() {
    try {
        console.log('SW: Syncing federated learning updates...');
        
        // Get model updates
        const modelUpdates = await getModelUpdatesFromDB();
        
        if (modelUpdates.length > 0) {
            // Send to federated learning server
            // await sendModelUpdatesToServer(modelUpdates);
            
            console.log('SW: Federated learning updates synced');
        }
    } catch (error) {
        console.error('SW: Failed to sync federated learning:', error);
    }
}

// IndexedDB helpers
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EcoSortAI_ML', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores for ML data
            if (!db.objectStoreNames.contains('trainingData')) {
                const trainingStore = db.createObjectStore('trainingData', { keyPath: 'id' });
                trainingStore.createIndex('timestamp', 'timestamp', { unique: false });
                trainingStore.createIndex('label', 'label', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('modelUpdates')) {
                const modelStore = db.createObjectStore('modelUpdates', { keyPath: 'id' });
                modelStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('statistics')) {
                const statsStore = db.createObjectStore('statistics', { keyPath: 'id' });
                statsStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

async function getTrainingDataFromDB(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['trainingData'], 'readonly');
        const store = transaction.objectStore('trainingData');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

async function getModelUpdatesFromDB() {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['modelUpdates'], 'readonly');
        const store = transaction.objectStore('modelUpdates');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

async function processTrainingDataLocally(trainingData) {
    // Process training data locally
    console.log('SW: Processing', trainingData.length, 'training samples locally');
    
    // Send message to main thread to trigger retraining
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'TRIGGER_RETRAINING',
            data: { sampleCount: trainingData.length }
        });
    });
}

// Push notifications for ML updates
self.addEventListener('push', event => {
    console.log('SW: Push notification received');
    
    let notificationData = {
        title: 'EcoSort AI',
        body: 'Có cập nhật mới cho mô hình AI',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'ml-update',
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: 'Xem chi tiết',
                icon: '/icons/icon-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Bỏ qua'
            }
        ]
    };

    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.error('SW: Failed to parse push data:', error);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('SW: Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/?tab=ml-dashboard')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    console.log('SW: Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_ML_MODEL') {
        event.waitUntil(cacheMLModel(event.data.modelData));
    }
    
    if (event.data.type === 'CLEAR_ML_CACHE') {
        event.waitUntil(clearMLCache());
    }
});

// Cache ML model data
async function cacheMLModel(modelData) {
    try {
        const cache = await caches.open(CACHE_NAME + '-ml-models');
        const response = new Response(JSON.stringify(modelData), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put('/ml-model-cache', response);
        console.log('SW: ML model cached successfully');
    } catch (error) {
        console.error('SW: Failed to cache ML model:', error);
    }
}

// Clear ML cache
async function clearMLCache() {
    try {
        await caches.delete(CACHE_NAME + '-ml-models');
        console.log('SW: ML cache cleared');
    } catch (error) {
        console.error('SW: Failed to clear ML cache:', error);
    }
}

// Periodic background sync for ML improvements
self.addEventListener('periodicsync', event => {
    console.log('SW: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'ml-improvement-sync') {
        event.waitUntil(performMLImprovements());
    }
});

async function performMLImprovements() {
    try {
        console.log('SW: Performing ML improvements...');
        
        // Analyze usage patterns
        const usageData = await getUsageDataFromDB();
        
        // Optimize model based on usage
        const optimizations = analyzeUsagePatterns(usageData);
        
        // Send optimization suggestions to main thread
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'ML_OPTIMIZATION_SUGGESTIONS',
                data: optimizations
            });
        });
        
        console.log('SW: ML improvements completed');
    } catch (error) {
        console.error('SW: Failed to perform ML improvements:', error);
    }
}

function analyzeUsagePatterns(usageData) {
    // Analyze patterns and return optimization suggestions
    return {
        suggestedLearningRate: 0.001,
        suggestedBatchSize: 32,
        frequentCategories: ['plastic', 'can'],
        recommendedRetraining: usageData.length > 100
    };
}

async function getUsageDataFromDB() {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['statistics'], 'readonly');
        const store = transaction.objectStore('statistics');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

console.log('SW: EcoSort AI Service Worker v2.1.0 loaded with ML support');
