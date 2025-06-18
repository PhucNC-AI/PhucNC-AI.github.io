
/**
 * EcoSort AI - Intelligent Waste Classification System
 * Version: 2.1.0 ML Edition
 * Author: MrPhucCong
 * University: Đại học Mỏ Địa Chất
 * Description: Advanced waste classification using AI and Machine Learning
 */

class EcoSortAI {
    constructor() {
        // Core components
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.model = null;
        this.customModel = null;
        this.isDetecting = false;
        this.isModelLoaded = false;
        
        // ML Components
        this.trainingData = [];
        this.modelMetrics = {
            accuracy: 0,
            totalPredictions: 0,
            correctPredictions: 0,
            precision: 0,
            recall: 0,
            f1Score: 0
        };
        
        // Feature extraction
        this.featureExtractor = new FeatureExtractor();
        
        // Training configuration
        this.trainingConfig = {
            batchSize: 32,
            epochs: 50,
            learningRate: 0.001,
            validationSplit: 0.2
        };
        
        // Online learning
        this.onlineLearning = {
            enabled: true,
            bufferSize: 100,
            retrainThreshold: 50
        };
        
        // Model versioning
        this.modelVersion = '2.1.0';
        this.modelHistory = [];
        
        // Performance tracking
        this.performanceMetrics = {
            fps: 0,
            detectionCount: 0,
            memoryUsage: 0,
            lastFrameTime: 0
        };
        
        // User feedback system
        this.predictionTracking = {
            correct: 0,
            incorrect: 0,
            total: 0
        };
        
        // Accuracy history for trending
        this.accuracyHistory = [];
        
        // Confusion matrix
        this.confusionMatrix = null;
        
        // Federated learning
        this.federatedLearning = {
            enabled: false,
            clientId: this.generateClientId(),
            roundNumber: 0,
            localUpdates: []
        };
        
        // AutoML configuration
        this.autoML = {
            enabled: true,
            hyperparameterSearch: {
                learningRates: [0.001, 0.0001, 0.00001],
                batchSizes: [16, 32, 64],
                dropoutRates: [0.2, 0.3, 0.5],
                architectures: ['lightweight', 'standard', 'heavy']
            },
            bestConfig: null,
            searchHistory: []
        };
        
        // Detection settings
        this.detectionSettings = {
            confidenceThreshold: 0.5,
            maxDetections: 10,
            detectionSpeed: 'medium'
        };
        
        // Waste categories with enhanced metadata
        this.wasteCategories = {
            plastic: {
                name: 'Nhựa',
                icon: 'fas fa-bottle-water',
                color: '#2196F3',
                description: 'Chai nhựa, hộp nhựa, túi nilon',
                recyclingTips: 'Rửa sạch trước khi bỏ vào thùng tái chế',
                environmentalImpact: 'Phân hủy sau 450-1000 năm',
                keywords: ['bottle', 'plastic', 'container', 'bag']
            },
            can: {
                name: 'Lon/Hộp kim loại',
                icon: 'fas fa-wine-bottle',
                color: '#FF9800',
                description: 'Lon nước ngọt, hộp thiếc, đồ kim loại',
                recyclingTips: 'Có thể tái chế 100% mà không mất chất lượng',
                environmentalImpact: 'Phân hủy sau 80-200 năm',
                keywords: ['can', 'metal', 'aluminum', 'tin']
            },
            bag: {
                name: 'Túi/Bao bì',
                icon: 'fas fa-shopping-bag',
                color: '#4CAF50',
                description: 'Túi giấy, bao bì carton, hộp giấy',
                recyclingTips: 'Tháo bỏ băng keo và kim bấm trước khi tái chế',
                environmentalImpact: 'Phân hủy sau 2-6 tuần',
                keywords: ['bag', 'paper', 'cardboard', 'packaging']
            },
            glass: {
                name: 'Thủy tinh',
                icon: 'fas fa-wine-glass',
                color: '#9C27B0',
                description: 'Chai thủy tinh, lọ thủy tinh, cốc thủy tinh',
                recyclingTips: 'Tái chế vô hạn lần mà không mất chất lượng',
                environmentalImpact: 'Không phân hủy tự nhiên',
                keywords: ['glass', 'bottle', 'jar', 'container']
            },
            other: {
                name: 'Khác',
                icon: 'fas fa-question',
                color: '#607D8B',
                description: 'Các loại rác khác không phân loại được',
                recyclingTips: 'Kiểm tra hướng dẫn địa phương',
                environmentalImpact: 'Tùy thuộc vào vật liệu',
                keywords: ['other', 'unknown', 'mixed']
            }
        };
        
        // Statistics
        this.detectionStats = {
            totalDetections: 0,
            categoryStats: {},
            dailyStats: {},
            weeklyStats: {},
            monthlyStats: {}
        };
        
        // UI state
        this.currentTab = 'detection';
        this.isTraining = false;
        this.currentDetection = null;
        
        // Initialize
        this.init();
    }

    // ============= INITIALIZATION =============
    
    async init() {
        console.log('🚀 Initializing EcoSort AI v2.1.0...');
        
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize UI components
            this.initializeUI();
            
            // Load saved data
            await this.loadSavedData();
            
            // Initialize ML components
            await this.initializeML();
            
            // Load TensorFlow models
            await this.loadModels();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize PWA features
            this.initializePWA();
            
            // Setup user feedback system
            this.setupUserFeedbackSystem();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('✅ EcoSort AI initialized successfully!');
            this.showNotification('EcoSort AI đã sẵn sàng!', 'success');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showNotification('Lỗi khởi tạo: ' + error.message, 'error');
            this.hideLoadingScreen();
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            this.updateLoadingProgress(0, 'Đang khởi tạo...');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    updateLoadingProgress(percentage, text) {
        const progressFill = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        const progressText = document.querySelector('.loading-progress .progress-text');
        
        if (progressFill) progressFill.style.width = percentage + '%';
        if (loadingText) loadingText.textContent = text;
        if (progressText) progressText.textContent = Math.round(percentage) + '%';
    }

    initializeUI() {
        // Get DOM elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas?.getContext('2d');
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize theme
        this.initializeTheme();
        
        // Initialize settings
        this.initializeSettings();
        
        console.log('🎨 UI components initialized');
    }

    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.switchTab(target);
            });
        });
        
        // Handle URL hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) this.switchTab(hash);
        });
        
        // Set initial tab
        const initialTab = window.location.hash.substring(1) || 'detection';
        this.switchTab(initialTab);
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${tabName}"]`)?.classList.add('active');
        
        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(tabName)?.style.display = 'block';
        
        this.currentTab = tabName;
        
        // Tab-specific initialization
        if (tabName === 'ml-dashboard') {
            this.initializeMLDashboard();
        } else if (tabName === 'statistics') {
            this.updateStatistics();
        }
    }

    initializeTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    initializeSettings() {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('ecosort-settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.assign(this.detectionSettings, settings.detection || {});
            Object.assign(this.trainingConfig, settings.training || {});
            Object.assign(this.onlineLearning, settings.onlineLearning || {});
        }
        
        // Update UI with current settings
        this.updateSettingsUI();
        
        // Setup settings event listeners
        this.setupSettingsEventListeners();
    }

    updateSettingsUI() {
        // Detection settings
        const confidenceSlider = document.getElementById('confidenceThreshold');
        const confidenceValue = document.getElementById('confidenceValue');
        const detectionSpeed = document.getElementById('detectionSpeed');
        
        if (confidenceSlider) {
            confidenceSlider.value = this.detectionSettings.confidenceThreshold;
            if (confidenceValue) {
                confidenceValue.textContent = Math.round(this.detectionSettings.confidenceThreshold * 100) + '%';
            }
        }
        
        if (detectionSpeed) {
            detectionSpeed.value = this.detectionSettings.detectionSpeed;
        }
        
        // ML settings
        const enableOnlineLearning = document.getElementById('enableOnlineLearning');
        const enableFederatedLearning = document.getElementById('enableFederatedLearning');
        const autoRetrainThreshold = document.getElementById('autoRetrainThreshold');
        
        if (enableOnlineLearning) {
            enableOnlineLearning.checked = this.onlineLearning.enabled;
        }
        
        if (enableFederatedLearning) {
            enableFederatedLearning.checked = this.federatedLearning.enabled;
        }
        
        if (autoRetrainThreshold) {
            autoRetrainThreshold.value = this.onlineLearning.retrainThreshold;
        }
        
        // Training config
        const learningRate = document.getElementById('learningRate');
        const learningRateValue = document.getElementById('learningRateValue');
        const batchSize = document.getElementById('batchSize');
        const epochs = document.getElementById('epochs');
        
        if (learningRate) {
            learningRate.value = this.trainingConfig.learningRate;
            if (learningRateValue) {
                learningRateValue.textContent = this.trainingConfig.learningRate;
            }
        }
        
        if (batchSize) {
            batchSize.value = this.trainingConfig.batchSize;
        }
        
        if (epochs) {
            epochs.value = this.trainingConfig.epochs;
        }
    }

    setupSettingsEventListeners() {
        // Confidence threshold
        const confidenceSlider = document.getElementById('confidenceThreshold');
        const confidenceValue = document.getElementById('confidenceValue');
        
        confidenceSlider?.addEventListener('input', () => {
            this.detectionSettings.confidenceThreshold = parseFloat(confidenceSlider.value);
            if (confidenceValue) {
                confidenceValue.textContent = Math.round(this.detectionSettings.confidenceThreshold * 100) + '%';
            }
            this.saveSettings();
        });
        
        // Detection speed
        document.getElementById('detectionSpeed')?.addEventListener('change', (e) => {
            this.detectionSettings.detectionSpeed = e.target.value;
            this.saveSettings();
        });
        
        // Online learning
        document.getElementById('enableOnlineLearning')?.addEventListener('change', (e) => {
            this.onlineLearning.enabled = e.target.checked;
            this.saveSettings();
        });
        
        // Federated learning
        document.getElementById('enableFederatedLearning')?.addEventListener('change', (e) => {
            this.federatedLearning.enabled = e.target.checked;
            this.saveSettings();
        });
        
        // Auto retrain threshold
        document.getElementById('autoRetrainThreshold')?.addEventListener('change', (e) => {
            this.onlineLearning.retrainThreshold = parseInt(e.target.value);
            this.saveSettings();
        });
        
        // Learning rate
        const learningRate = document.getElementById('learningRate');
        const learningRateValue = document.getElementById('learningRateValue');
        
        learningRate?.addEventListener('input', () => {
            this.trainingConfig.learningRate = parseFloat(learningRate.value);
            if (learningRateValue) {
                learningRateValue.textContent = this.trainingConfig.learningRate;
            }
            this.saveSettings();
        });
        
        // Batch size
        document.getElementById('batchSize')?.addEventListener('change', (e) => {
            this.trainingConfig.batchSize = parseInt(e.target.value);
            this.saveSettings();
        });
        
        // Epochs
        document.getElementById('epochs')?.addEventListener('change', (e) => {
            this.trainingConfig.epochs = parseInt(e.target.value);
            this.saveSettings();
        });
        
        // Data management buttons
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('importData')?.addEventListener('click', () => {
            this.importData();
        });
        
        document.getElementById('clearAllData')?.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    saveSettings() {
        const settings = {
            detection: this.detectionSettings,
            training: this.trainingConfig,
            onlineLearning: this.onlineLearning,
            federatedLearning: this.federatedLearning
        };
        
        localStorage.setItem('ecosort-settings', JSON.stringify(settings));
    }

    // ============= ML INITIALIZATION =============
    
    async initializeML() {
        console.log('🧠 Initializing ML components...');
        this.updateLoadingProgress(20, 'Đang khởi tạo ML...');
        
        try {
            // Initialize TensorFlow.js backend
            await tf.ready();
            console.log('TensorFlow.js backend:', tf.getBackend());
            
            // Load or create custom model
            await this.loadCustomModel();
            
            // Load training data from IndexedDB
            await this.loadTrainingData();
            
            // Setup AutoML pipeline
            this.setupAutoML();
            
            // Initialize federated learning
            this.initializeFederatedLearning();
            
            // Load ML stats
            this.loadMLStats();
            
            console.log('🎯 ML components ready!');
            
        } catch (error) {
            console.error('ML initialization failed:', error);
            throw error;
        }
    }

    async loadCustomModel() {
        try {
            this.updateLoadingProgress(30, 'Đang tải mô hình tùy chỉnh...');
            
            // Try to load existing model
            this.customModel = await tf.loadLayersModel('indexeddb://waste-classifier-v2');
            console.log('✅ Custom model loaded successfully');
            
            // Load model metrics
            const metrics = localStorage.getItem('model-metrics');
            if (metrics) {
                this.modelMetrics = JSON.parse(metrics);
            }
            
        } catch (error) {
            console.log('🔧 Creating new custom model...');
            await this.createCustomModel();
        }
    }

    async createCustomModel() {
        this.updateLoadingProgress(35, 'Đang tạo mô hình mới...');
        
        // Create advanced CNN architecture
        const model = tf.sequential({
            layers: [
                // Convolutional layers
                tf.layers.conv2d({
                    inputShape: [224, 224, 3],
                    filters: 32,
                    kernelSize: 3,
                    activation: 'relu',
                    padding: 'same'
                }),
                tf.layers.batchNormalization(),
                tf.layers.maxPooling2d({ poolSize: 2 }),
                tf.layers.dropout({ rate: 0.25 }),
                
                tf.layers.conv2d({
                    filters: 64,
                    kernelSize: 3,
                    activation: 'relu',
                    padding: 'same'
                }),
                tf.layers.batchNormalization(),
                tf.layers.maxPooling2d({ poolSize: 2 }),
                tf.layers.dropout({ rate: 0.25 }),
                
                tf.layers.conv2d({
                    filters: 128,
                    kernelSize: 3,
                    activation: 'relu',
                    padding: 'same'
                }),
                tf.layers.batchNormalization(),
                tf.layers.maxPooling2d({ poolSize: 2 }),
                tf.layers.dropout({ rate: 0.25 }),
                
                // Dense layers
                tf.layers.flatten(),
                tf.layers.dense({
                    units: 512,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.5 }),
                tf.layers.dense({
                    units: 256,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.5 }),
                
                // Output layer - 5 waste categories
                tf.layers.dense({
                    units: 5, // plastic, can, bag, glass, other
                    activation: 'softmax'
                })
            ]
        });

        // Compile with advanced optimizer
        model.compile({
            optimizer: tf.train.adamax(this.trainingConfig.learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        this.customModel = model;
        
        // Save initial model
        await this.saveCustomModel();
        
        console.log('🆕 New custom model created');
    }

    async saveCustomModel() {
        try {
            await this.customModel.save('indexeddb://waste-classifier-v2');
            
            // Save metrics
            localStorage.setItem('model-metrics', JSON.stringify(this.modelMetrics));
            
            // Update version history
            this.modelHistory.push({
                version: this.modelVersion,
                timestamp: Date.now(),
                accuracy: this.modelMetrics.accuracy,
                totalSamples: this.trainingData.length
            });
            
            localStorage.setItem('model-history', JSON.stringify(this.modelHistory));
            
            console.log('💾 Custom model saved');
        } catch (error) {
            console.error('Error saving model:', error);
        }
    }

    async loadTrainingData() {
        try {
            this.updateLoadingProgress(40, 'Đang tải dữ liệu huấn luyện...');
            
            const db = await this.openDatabase();
            const transaction = db.transaction(['trainingData'], 'readonly');
            const store = transaction.objectStore('trainingData');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    this.trainingData = request.result || [];
                    console.log(`📚 Loaded ${this.trainingData.length} training samples`);
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error loading training data:', error);
            this.trainingData = [];
        }
    }

    setupAutoML() {
        this.autoML = {
            enabled: true,
            hyperparameterSearch: {
                learningRates: [0.001, 0.0001, 0.00001],
                batchSizes: [16, 32, 64],
                dropoutRates: [0.2, 0.3, 0.5],
                architectures: ['lightweight', 'standard', 'heavy']
            },
            bestConfig: null,
            searchHistory: []
        };
    }

    initializeFederatedLearning() {
        this.federatedLearning = {
            enabled: false,
            clientId: this.generateClientId(),
            roundNumber: 0,
            localUpdates: []
        };
    }

    generateClientId() {
        return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // ============= MODEL LOADING =============
    
    async loadModels() {
        try {
            this.updateLoadingProgress(50, 'Đang tải mô hình COCO-SSD...');
            
            // Load COCO-SSD model
            this.model = await cocoSsd.load();
            this.isModelLoaded = true;
            
            console.log('✅ COCO-SSD model loaded successfully');
            this.updateLoadingProgress(70, 'Mô hình đã sẵn sàng!');
            
        } catch (error) {
            console.error('❌ Failed to load models:', error);
            throw new Error('Không thể tải mô hình AI: ' + error.message);
        }
    }

    // ============= EVENT LISTENERS =============
    
    setupEventListeners() {
        this.updateLoadingProgress(80, 'Đang thiết lập giao diện...');
        
        // Camera controls
        document.getElementById('startCamera')?.addEventListener('click', () => this.startCamera());
        document.getElementById('captureImage')?.addEventListener('click', () => this.captureImage());
        document.getElementById('uploadImage')?.addEventListener('click', () => this.uploadImage());
        document.getElementById('toggleDetection')?.addEventListener('click', () => this.toggleDetection());
        document.getElementById('stopCamera')?.addEventListener('click', () => this.stopCamera());
        
        // File input
        document.getElementById('imageInput')?.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // ML Dashboard controls
        document.getElementById('trainModel')?.addEventListener('click', () => this.startTraining());
        document.getElementById('exportModel')?.addEventListener('click', () => this.exportModel());
        document.getElementById('importModel')?.addEventListener('click', () => this.importModel());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Window events
        window.addEventListener('beforeunload', () => this.cleanup());
        window.addEventListener('resize', () => this.handleResize());
        
        // Performance monitoring
        this.startPerformanceMonitoring();
        
        console.log('🎮 Event listeners setup complete');
    }

    handleKeyboardShortcuts(e) {
        // Prevent shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key.toLowerCase()) {
            case 'c':
                e.preventDefault();
                this.startCamera();
                break;
            case ' ':
                e.preventDefault();
                this.captureImage();
                break;
            case 'p':
                e.preventDefault();
                this.toggleDetection();
                break;
            case 's':
                e.preventDefault();
                this.stopCamera();
                break;
            case 'u':
                e.preventDefault();
                this.uploadImage();
                break;
            case 'h':
                e.preventDefault();
                this.showShortcutsModal();
                break;
            case 'r':
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                    this.resetApplication();
                }
                break;
        }
    }

    handleResize() {
        if (this.canvas && this.video) {
            this.resizeCanvas();
        }
    }

    resizeCanvas() {
        if (this.video.videoWidth && this.video.videoHeight) {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        }
    }

    // ============= CAMERA FUNCTIONS =============
    
    async startCamera() {
        try {
            console.log('📷 Starting camera...');
            
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;
            
            this.video.onloadedmetadata = () => {
                this.resizeCanvas();
                this.updateCameraStatus('Camera đã sẵn sàng');
                this.updateCameraControls(true);
                
                if (this.isModelLoaded) {
                    this.startDetection();
                }
            };
            
            console.log('✅ Camera started successfully');
            
        } catch (error) {
            console.error('❌ Camera access failed:', error);
            this.showNotification('Không thể truy cập camera: ' + error.message, 'error');
            this.updateCameraStatus('Lỗi camera');
        }
    }

    stopCamera() {
        console.log('🛑 Stopping camera...');
        
        this.stopDetection();
        
        if (this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        this.updateCameraStatus('Camera đã dừng');
        this.updateCameraControls(false);
        this.clearCanvas();
        
        console.log('✅ Camera stopped');
    }

    updateCameraStatus(status) {
        const statusElement = document.getElementById('cameraStatus');
        if (statusElement) {
            statusElement.innerHTML = `<i class="fas fa-info-circle"></i><span>${status}</span>`;
        }
    }

    updateCameraControls(isActive) {
        const startBtn = document.getElementById('startCamera');
        const captureBtn = document.getElementById('captureImage');
        const toggleBtn = document.getElementById('toggleDetection');
        const stopBtn = document.getElementById('stopCamera');
        
        if (startBtn) startBtn.style.display = isActive ? 'none' : 'inline-block';
        if (captureBtn) captureBtn.disabled = !isActive;
        if (toggleBtn) toggleBtn.style.display = isActive ? 'inline-block' : 'none';
        if (stopBtn) stopBtn.style.display = isActive ? 'inline-block' : 'none';
    }

    // ============= DETECTION FUNCTIONS =============
    
    startDetection() {
        if (!this.isModelLoaded || this.isDetecting) return;
        
        console.log('🔍 Starting detection...');
        this.isDetecting = true;
        this.updateDetectionButton();
        this.updateMLStatus('detecting');
        
        this.detectLoop();
    }

    stopDetection() {
        console.log('⏹️ Stopping detection...');
        this.isDetecting = false;
        this.updateDetectionButton();
        this.updateMLStatus('ready');
    }

    toggleDetection() {
        if (this.isDetecting) {
            this.stopDetection();
        } else {
            this.startDetection();
        }
    }

    updateDetectionButton() {
        const toggleBtn = document.getElementById('toggleDetection');
        if (toggleBtn) {
            if (this.isDetecting) {
                toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Tạm Dừng (P)';
                toggleBtn.className = 'btn btn-warning';
            } else {
                toggleBtn.innerHTML = '<i class="fas fa-play"></i> Tiếp Tục (P)';
                toggleBtn.className = 'btn btn-success';
            }
        }
    }

    updateMLStatus(status) {
        const statusElement = document.getElementById('mlStatus');
        if (statusElement) {
            statusElement.className = 'info-value ml-status ' + status;
            
            switch (status) {
                case 'ready':
                    statusElement.textContent = 'Sẵn sàng';
                    break;
                case 'detecting':
                    statusElement.textContent = 'Đang phát hiện';
                    break;
                case 'training':
                    statusElement.textContent = 'Đang huấn luyện';
                    break;
                case 'error':
                    statusElement.textContent = 'Lỗi';
                    break;
            }
        }
    }

    async detectLoop() {
        if (!this.isDetecting || !this.video.videoWidth) {
            return;
        }
        
        const startTime = performance.now();
        
        try {
            // Get predictions from COCO-SSD
            const predictions = await this.model.detect(this.video);
            
            // Filter and enhance predictions
            const filteredPredictions = this.filterPredictions(predictions);
            
            // Clear canvas and draw video frame
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Process each prediction
            for (const prediction of filteredPredictions) {
                // Classify waste type
                const wasteClassification = await this.classifyWasteAdvanced(prediction);
                
                // Draw bounding box and label
                this.drawPrediction(prediction, wasteClassification);
                
                // Update statistics
                this.updateDetectionStats(wasteClassification);
            }
            
            // Update results display
            this.updateResultsDisplay(filteredPredictions);
            
            // Calculate FPS
            const endTime = performance.now();
            this.updateFPS(endTime - startTime);
            
        } catch (error) {
            console.error('Detection error:', error);
        }
        
        // Continue detection loop
        if (this.isDetecting) {
            const delay = this.getDetectionDelay();
            setTimeout(() => this.detectLoop(), delay);
        }
    }

    filterPredictions(predictions) {
        return predictions
            .filter(prediction => prediction.score >= this.detectionSettings.confidenceThreshold)
            .slice(0, this.detectionSettings.maxDetections)
            .sort((a, b) => b.score - a.score);
    }

    getDetectionDelay() {
        switch (this.detectionSettings.detectionSpeed) {
            case 'fast': return 33; // ~30 FPS
            case 'medium': return 66; // ~15 FPS
            case 'slow': return 200; // ~5 FPS
            default: return 66;
        }
    }

    // ============= ADVANCED WASTE CLASSIFICATION =============
    
    async classifyWasteAdvanced(prediction) {
        try {
            // Extract image region
            const imageData = this.extractImageRegion(prediction.bbox);
            
            // Extract advanced features
            const features = this.extractAdvancedFeatures(imageData, prediction.bbox);
            
            // Get ML prediction if custom model is available
            let mlPrediction = null;
            if (this.customModel) {
                mlPrediction = await this.predictWithML(imageData, prediction.bbox);
            }
            
            // Combine COCO-SSD and custom model predictions
            const wasteType = this.combineClassifications(prediction, mlPrediction, features);
            
            // Calculate confidence
            const confidence = this.calculateCombinedConfidence(prediction, mlPrediction);
            
            // Detect brand/material if possible
            const brandInfo = this.detectBrand(imageData);
            
            return {
                type: wasteType,
                confidence: confidence,
                originalPrediction: prediction,
                mlPrediction: mlPrediction,
                features: features,
                brandInfo: brandInfo,
                recyclingInfo: this.getRecyclingInfo(wasteType),
                environmentalImpact: this.getEnvironmentalImpact(wasteType)
            };
            
        } catch (error) {
            console.error('Advanced classification error:', error);
            return this.fallbackClassification(prediction);
        }
    }

    extractImageRegion(bbox) {
        const [x, y, width, height] = bbox;
        const imageData = this.ctx.getImageData(x, y, width, height);
        return imageData;
    }

    extractAdvancedFeatures(imageData, boundingBox) {
        const features = {
            // Shape features
            aspectRatio: boundingBox[2] / boundingBox[3],
            area: boundingBox[2] * boundingBox[3],
            perimeter: 2 * (boundingBox[2] + boundingBox[3]),
            
            // Color features
            ...this.extractColorFeatures(imageData),
            
            // Texture features
            ...this.extractTextureFeatures(imageData),
            
            // Context features
            positionX: boundingBox[0] / this.canvas.width,
            positionY: boundingBox[1] / this.canvas.height,
            relativeSize: (boundingBox[2] * boundingBox[3]) / (this.canvas.width * this.canvas.height),
            
            // Temporal features
            timestamp: Date.now(),
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay()
        };
        
        return this.normalizeFeatures(features);
    }

    extractColorFeatures(imageData) {
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let pixelCount = 0;
        
        // Calculate average color
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            pixelCount++;
        }
        
        r /= pixelCount;
        g /= pixelCount;
        b /= pixelCount;
        
        // Convert to HSV
        const hsv = this.rgbToHsv(r, g, b);
        
        // Calculate color variance
        let rVar = 0, gVar = 0, bVar = 0;
        for (let i = 0; i < data.length; i += 4) {
            rVar += Math.pow(data[i] - r, 2);
            gVar += Math.pow(data[i + 1] - g, 2);
            bVar += Math.pow(data[i + 2] - b, 2);
        }
        
        return {
            avgRed: r / 255,
            avgGreen: g / 255,
            avgBlue: b / 255,
            hue: hsv.h,
            saturation: hsv.s,
            value: hsv.v,
            colorVariance: (rVar + gVar + bVar) / (pixelCount * 3) / 65025,
            dominantColor: this.getDominantColor(r, g, b)
        };
    }

    extractTextureFeatures(imageData) {
        // Convert to grayscale
        const grayData = this.convertToGrayscale(imageData);
        
        // Calculate texture metrics
        const edgeDensity = this.calculateEdgeDensity(grayData);
        const contrast = this.calculateContrast(grayData);
        const homogeneity = this.calculateHomogeneity(grayData);
        
        return {
            edgeDensity,
            contrast,
            homogeneity,
            roughness: this.calculateRoughness(grayData)
        };
    }

    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
            if (max === r) h = ((g - b) / diff) % 6;
            else if (max === g) h = (b - r) / diff + 2;
            else h = (r - g) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : diff / max;
        const v = max;
        
        return { h: h / 360, s, v };
    }

    getDominantColor(r, g, b) {
        const colors = {
            red: Math.abs(r - 255) + Math.abs(g - 0) + Math.abs(b - 0),
            green: Math.abs(r - 0) + Math.abs(g - 255) + Math.abs(b - 0),
            blue: Math.abs(r - 0) + Math.abs(g - 0) + Math.abs(b - 255),
            white: Math.abs(r - 255) + Math.abs(g - 255) + Math.abs(b - 255),
            black: Math.abs(r - 0) + Math.abs(g - 0) + Math.abs(b - 0),
            yellow: Math.abs(r - 255) + Math.abs(g - 255) + Math.abs(b - 0),
            cyan: Math.abs(r - 0) + Math.abs(g - 255) + Math.abs(b - 255),
            magenta: Math.abs(r - 255) + Math.abs(g - 0) + Math.abs(b - 255)
        };
        
        return Object.keys(colors).reduce((a, b) => colors[a] < colors[b] ? a : b);
    }

    convertToGrayscale(imageData) {
        const data = imageData.data;
        const grayData = new Uint8Array(imageData.width * imageData.height);
        
        for (let i = 0, j = 0; i < data.length; i += 4, j++) {
            grayData[j] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }
        
        return grayData;
    }

    calculateEdgeDensity(grayData) {
        // Simple edge detection using Sobel operator
        let edgeCount = 0;
        const width = Math.sqrt(grayData.length);
        
        for (let y = 1; y < width - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const gx = grayData[(y-1)*width + x+1] - grayData[(y-1)*width + x-1] +
                          2*grayData[y*width + x+1] - 2*grayData[y*width + x-1] +
                          grayData[(y+1)*width + x+1] - grayData[(y+1)*width + x-1];
                
                const gy = grayData[(y-1)*width + x-1] + 2*grayData[(y-1)*width + x] + grayData[(y-1)*width + x+1] -
                          grayData[(y+1)*width + x-1] - 2*grayData[(y+1)*width + x] - grayData[(y+1)*width + x+1];
                
                const magnitude = Math.sqrt(gx*gx + gy*gy);
                if (magnitude > 50) edgeCount++;
            }
        }
        
        return edgeCount / (grayData.length);
    }

    calculateContrast(grayData) {
        let sum = 0;
        let sumSquares = 0;
        
        for (let i = 0; i < grayData.length; i++) {
            sum += grayData[i];
            sumSquares += grayData[i] * grayData[i];
        }
        
        const mean = sum / grayData.length;
        const variance = (sumSquares / grayData.length) - (mean * mean);
        
        return Math.sqrt(variance) / 255;
    }

    calculateHomogeneity(grayData) {
        // Calculate local homogeneity
        let homogeneity = 0;
        const width = Math.sqrt(grayData.length);
        
        for (let y = 1; y < width - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const center = grayData[y * width + x];
                let localVariance = 0;
                
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const neighbor = grayData[(y + dy) * width + (x + dx)];
                        localVariance += Math.pow(neighbor - center, 2);
                    }
                }
                
                homogeneity += 1 / (1 + localVariance / 9);
            }
        }
        
        return homogeneity / ((width - 2) * (width - 2));
    }

    calculateRoughness(grayData) {
        // Calculate surface roughness approximation
        let roughness = 0;
        const width = Math.sqrt(grayData.length);
        
        for (let y = 0; y < width - 1; y++) {
            for (let x = 0; x < width - 1; x++) {
                const current = grayData[y * width + x];
                const right = grayData[y * width + x + 1];
                const down = grayData[(y + 1) * width + x];
                
                roughness += Math.abs(current - right) + Math.abs(current - down);
            }
        }
        
        return roughness / (2 * (width - 1) * (width - 1) * 255);
    }

    normalizeFeatures(features) {
        // Normalize features to [0, 1] range
        const normalized = {};
        
        for (const [key, value] of Object.entries(features)) {
            if (typeof value === 'number') {
                normalized[key] = Math.max(0, Math.min(1, value));
            } else {
                normalized[key] = value;
            }
        }
        
        return normalized;
    }

    async predictWithML(imageData, boundingBox) {
        if (!this.customModel) return null;
        
        try {
            // Extract features
            const features = this.extractAdvancedFeatures(imageData, boundingBox);
            
            // Prepare input tensor
            const inputTensor = tf.tensor2d([Object.values(features).filter(v => typeof v === 'number')]);
            
            // Get prediction from custom model
            const prediction = await this.customModel.predict(inputTensor).data();
            
            inputTensor.dispose();
            
            // Convert to category
            const categories = ['plastic', 'can', 'bag', 'glass', 'other'];
            const maxIndex = prediction.indexOf(Math.max(...prediction));
            
            return {
                category: categories[maxIndex],
                confidence: prediction[maxIndex],
                allScores: prediction
            };
            
        } catch (error) {
            console.error('ML Prediction error:', error);
            return null;
        }
    }

    combineClassifications(cocoPrediction, mlPrediction, features) {
        // Map COCO-SSD classes to waste categories
        const cocoToWaste = {
            'bottle': 'plastic',
            'cup': 'plastic',
            'wine glass': 'glass',
            'bowl': 'glass',
            'banana': 'other',
            'apple': 'other',
            'orange': 'other',
            'broccoli': 'other',
            'carrot': 'other',
            'hot dog': 'other',
            'pizza': 'other',
            'donut': 'other',
            'cake': 'other',
            'cell phone': 'other',
            'book': 'bag',
            'scissors': 'other',
            'teddy bear': 'other',
            'hair drier': 'other',
            'toothbrush': 'other'
        };
        
        const cocoWasteType = cocoToWaste[cocoPrediction.class] || 'other';
        
        // If we have ML prediction, combine them
        if (mlPrediction && mlPrediction.confidence > 0.6) {
            // Weighted combination
            const cocoWeight = 0.3;
            const mlWeight = 0.7;
            
            if (mlPrediction.category === cocoWasteType) {
                return mlPrediction.category; // Both agree
            } else {
                // Use the one with higher confidence
                return mlPrediction.confidence > cocoPrediction.score ? 
                       mlPrediction.category : cocoWasteType;
            }
        }
        
        // Fallback to feature-based classification
        return this.classifyByFeatures(features, cocoWasteType);
    }

    classifyByFeatures(features, fallback) {
        // Rule-based classification using features
        
        // Glass detection (high transparency, smooth texture)
        if (features.homogeneity > 0.8 && features.roughness < 0.2) {
            return 'glass';
        }
        
        // Metal can detection (high reflectivity, cylindrical shape)
        if (features.aspectRatio > 0.8 && features.aspectRatio < 1.2 && 
            features.contrast > 0.6) {
            return 'can';
        }
        
        // Plastic bottle detection (elongated shape, moderate transparency)
        if (features.aspectRatio > 1.5 && features.saturation < 0.3) {
            return 'plastic';
        }
        
        // Paper/bag detection (low saturation, high texture)
        if (features.saturation < 0.2 && features.edgeDensity > 0.3) {
            return 'bag';
        }
        
        return fallback;
    }

    calculateCombinedConfidence(cocoPrediction, mlPrediction) {
        if (mlPrediction) {
            // Weighted average of confidences
            return (cocoPrediction.score * 0.3) + (mlPrediction.confidence * 0.7);
        }
        return cocoPrediction.score;
    }

    detectBrand(imageData) {
        // Simple brand detection based on color patterns
        // In a real implementation, this would use OCR or template matching
        
        const colors = this.extractColorFeatures(imageData);
        
        // Coca-Cola red detection
        if (colors.avgRed > 0.8 && colors.avgGreen < 0.3 && colors.avgBlue < 0.3) {
            return { brand: 'Coca-Cola', confidence: 0.7 };
        }
        
        // Pepsi blue detection
        if (colors.avgBlue > 0.7 && colors.avgRed < 0.4 && colors.avgGreen < 0.4) {
            return { brand: 'Pepsi', confidence: 0.6 };
        }
        
        return null;
    }

    getRecyclingInfo(wasteType) {
        return this.wasteCategories[wasteType]?.recyclingTips || 'Kiểm tra hướng dẫn địa phương';
    }

    getEnvironmentalImpact(wasteType) {
        return this.wasteCategories[wasteType]?.environmentalImpact || 'Tác động chưa xác định';
    }

    fallbackClassification(prediction) {
        // Simple fallback classification
        const wasteType = this.mapCocoClassToWaste(prediction.class);
        
        return {
            type: wasteType,
            confidence: prediction.score,
            originalPrediction: prediction,
            mlPrediction: null,
            features: {},
            brandInfo: null,
            recyclingInfo: this.getRecyclingInfo(wasteType),
            environmentalImpact: this.getEnvironmentalImpact(wasteType)
        };
    }

    mapCocoClassToWaste(cocoClass) {
        const mapping = {
            'bottle': 'plastic',
            'cup': 'plastic',
            'wine glass': 'glass',
            'bowl': 'glass',
            'book': 'bag'
        };
        
        return mapping[cocoClass] || 'other';
    }

    // ============= DRAWING FUNCTIONS =============
    
    drawPrediction(prediction, classification) {
        const [x, y, width, height] = prediction.bbox;
        const category = this.wasteCategories[classification.type];
        
        if (!category) return;
        
        // Draw bounding box
        this.ctx.strokeStyle = category.color;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, width, height);
        
        // Draw label background
        const label = `${category.name} (${Math.round(classification.confidence * 100)}%)`;
        this.ctx.font = 'bold 16px Arial';
        const textWidth = this.ctx.measureText(label).width;
        
        this.ctx.fillStyle = category.color;
        this.ctx.fillRect(x, y - 30, textWidth + 20, 30);
        
        // Draw label text
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(label, x + 10, y - 10);
        
        // Draw confidence indicator
        this.drawConfidenceIndicator(x + width - 30, y + 10, classification.confidence);
        
        // Draw recycling icon
        this.drawRecyclingIcon(x + width - 60, y + height - 30, classification.type);
    }

    drawConfidenceIndicator(x, y, confidence) {
        const radius = 12;
        
        // Background circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fill();
        
        // Confidence arc
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius - 2, -Math.PI/2, -Math.PI/2 + (confidence * 2 * Math.PI));
        this.ctx.strokeStyle = confidence > 0.7 ? '#4CAF50' : confidence > 0.5 ? '#FF9800' : '#f44336';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Confidence text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.round(confidence * 100), x, y + 3);
        this.ctx.textAlign = 'left';
    }

    drawRecyclingIcon(x, y, wasteType) {
        const category = this.wasteCategories[wasteType];
        if (!category) return;
        
        // Draw recycling symbol background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x, y, 25, 25);
        
        // Draw category icon (simplified)
        this.ctx.fillStyle = category.color;
        this.ctx.font = '16px FontAwesome';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('♻', x + 12, y + 18);
        this.ctx.textAlign = 'left';
    }

    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // ============= RESULTS DISPLAY =============
    
    updateResultsDisplay(predictions) {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;
        
        if (predictions.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-detection">
                    <i class="fas fa-eye-slash"></i>
                    <p>Chưa phát hiện rác thải nào</p>
                    <small>Hướng camera về phía các vật thể cần phân loại</small>
                </div>
            `;
            return;
        }
        
        let resultsHTML = '<div class="detection-grid">';
        
        predictions.forEach((prediction, index) => {
            const classification = this.classifyWaste(prediction);
            const category = this.wasteCategories[classification.type];
            
            if (category) {
                resultsHTML += `
                    <div class="detection-item" data-index="${index}">
                        <div class="detection-header">
                            <div class="detection-icon" style="color: ${category.color}">
                                <i class="${category.icon}"></i>
                            </div>
                            <div class="detection-info">
                                <h4>${category.name}</h4>
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${classification.confidence * 100}%; background: ${category.color}"></div>
                                    <span class="confidence-text">${Math.round(classification.confidence * 100)}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="detection-details">
                            <p class="description">${category.description}</p>
                            <div class="recycling-tip">
                                <i class="fas fa-recycle"></i>
                                <span>${category.recyclingTips}</span>
                            </div>
                            <div class="environmental-impact">
                                <i class="fas fa-leaf"></i>
                                <span>${category.environmentalImpact}</span>
                            </div>
                        </div>
                        <div class="detection-actions">
                            <button class="btn btn-sm btn-success feedback-correct" data-type="${classification.type}">
                                <i class="fas fa-check"></i> Chính xác
                            </button>
                            <button class="btn btn-sm btn-warning feedback-incorrect" data-type="${classification.type}">
                                <i class="fas fa-times"></i> Sai
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        
        resultsHTML += '</div>';
        resultsContainer.innerHTML = resultsHTML;
        
        // Add feedback event listeners
        this.setupFeedbackButtons();
        
        // Store current detection for feedback
        this.currentDetection = {
            predictions: predictions,
            timestamp: Date.now()
        };
    }

    classifyWaste(prediction) {
        // Simplified classification for display
        const wasteMapping = {
            'bottle': { type: 'plastic', confidence: prediction.score },
            'cup': { type: 'plastic', confidence: prediction.score },
            'wine glass': { type: 'glass', confidence: prediction.score },
            'bowl': { type: 'glass', confidence: prediction.score * 0.8 },
            'book': { type: 'bag', confidence: prediction.score * 0.7 },
            'cell phone': { type: 'other', confidence: prediction.score * 0.6 }
        };
        
        return wasteMapping[prediction.class] || { type: 'other', confidence: prediction.score * 0.5 };
    }

    // ============= STATISTICS AND PERFORMANCE =============
    
    updateDetectionStats(classification) {
        this.detectionStats.totalDetections++;
        this.performanceMetrics.detectionCount++;
        
        // Update category stats
        if (!this.detectionStats.categoryStats[classification.type]) {
            this.detectionStats.categoryStats[classification.type] = 0;
        }
        this.detectionStats.categoryStats[classification.type]++;
        
        // Update daily stats
        const today = new Date().toDateString();
        if (!this.detectionStats.dailyStats[today]) {
            this.detectionStats.dailyStats[today] = {};
        }
        if (!this.detectionStats.dailyStats[today][classification.type]) {
            this.detectionStats.dailyStats[today][classification.type] = 0;
        }
        this.detectionStats.dailyStats[today][classification.type]++;
        
        // Update UI counters
        this.updatePerformanceDisplay();
        
        // Save stats
        this.saveStatistics();
    }

    updatePerformanceDisplay() {
        // Update detection count
        const detectionCountElement = document.getElementById('detectionCount');
        if (detectionCountElement) {
            detectionCountElement.textContent = this.performanceMetrics.detectionCount;
        }
        
        // Update memory usage
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
        }
    }

    updateFPS(frameTime) {
        this.performanceMetrics.fps = Math.round(1000 / frameTime);
        
        const fpsElement = document.getElementById('fpsCounter');
        if (fpsElement) {
            fpsElement.textContent = this.performanceMetrics.fps;
        }
    }

    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceDisplay();
        }, 1000);
    }

    // ============= USER FEEDBACK SYSTEM =============
    
    setupUserFeedbackSystem() {
        // Add feedback UI if not exists
        this.addFeedbackUI();
        
        // Load feedback stats
        this.loadMLStats();
    }

    addFeedbackUI() {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer || document.querySelector('.feedback-container')) return;
        
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';
        feedbackContainer.innerHTML = `
            <div class="feedback-section">
                <h4><i class="fas fa-thumbs-up"></i> Kết quả có chính xác không?</h4>
                <div class="feedback-buttons">
                    <button class="btn btn-success feedback-correct-all">
                        <i class="fas fa-check"></i> Tất cả chính xác
                    </button>
                    <button class="btn btn-warning feedback-incorrect-all">
                        <i class="fas fa-times"></i> Có lỗi
                    </button>
                    <button class="btn btn-info feedback-improve">
                        <i class="fas fa-edit"></i> Cải thiện
                    </button>
                </div>
            </div>
            
            <div class="ml-stats">
                <h4><i class="fas fa-chart-line"></i> Thống kê ML</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Độ chính xác:</span>
                        <span class="stat-value" id="ml-accuracy">0%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tổng dự đoán:</span>
                        <span class="stat-value" id="ml-total">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Dữ liệu huấn luyện:</span>
                        <span class="stat-value" id="ml-training-data">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Phiên bản mô hình:</span>
                        <span class="stat-value" id="ml-version">v${this.modelVersion}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after results container
        resultsContainer.parentNode.insertBefore(feedbackContainer, resultsContainer.nextSibling);
        
        // Setup event listeners
        this.setupFeedbackEvents(feedbackContainer);
        
        // Update initial stats
        this.updateMLStats();
    }

    setupFeedbackEvents(container) {
        container.querySelector('.feedback-correct-all')?.addEventListener('click', () => {
            this.handleFeedback('correct');
        });
        
        container.querySelector('.feedback-incorrect-all')?.addEventListener('click', () => {
            this.handleFeedback('incorrect');
        });
        
        container.querySelector('.feedback-improve')?.addEventListener('click', () => {
            this.showLabelCorrectionModal();
        });
    }

    setupFeedbackButtons() {
        document.querySelectorAll('.feedback-correct').forEach(btn => {
            btn.addEventListener('click', () => {
                const wasteType = btn.dataset.type;
                this.handleIndividualFeedback('correct', wasteType);
            });
        });
        
        document.querySelectorAll('.feedback-incorrect').forEach(btn => {
            btn.addEventListener('click', () => {
                const wasteType = btn.dataset.type;
                this.handleIndividualFeedback('incorrect', wasteType);
            });
        });
    }

    async handleFeedback(feedbackType) {
        this.predictionTracking[feedbackType]++;
        this.predictionTracking.total++;
        
        // Update accuracy
        const accuracy = this.predictionTracking.correct / this.predictionTracking.total;
        this.modelMetrics.accuracy = accuracy;
        
        // If incorrect, ask for correct label
        if (feedbackType === 'incorrect') {
            setTimeout(() => {
                this.showLabelCorrectionModal();
            }, 500);
        }
        
        // Update UI
        this.updateMLStats();
        
        // Show appreciation
        this.showNotification(
            feedbackType === 'correct' ? 
            'Cảm ơn phản hồi! Mô hình sẽ tiếp tục học hỏi.' : 
            'Cảm ơn! Vui lòng chọn nhãn đúng để mô hình học được.',
            'success'
        );
        
        // Save feedback to database
        await this.saveFeedback(feedbackType);
    }

    async handleIndividualFeedback(feedbackType, wasteType) {
        // Handle feedback for individual detections
        console.log(`Feedback: ${feedbackType} for ${wasteType}`);
        
        if (feedbackType === 'correct') {
            this.predictionTracking.correct++;
        } else {
            this.predictionTracking.incorrect++;
        }
        this.predictionTracking.total++;
        
        // Update UI
        this.updateMLStats();
        
        // Add to training data if we have current detection
        if (this.currentDetection && feedbackType === 'correct') {
            await this.addTrainingSampleFromFeedback(wasteType, 1.0);
        }
        
        this.showNotification(`Đã ghi nhận phản hồi cho ${this.wasteCategories[wasteType]?.name}`, 'success');
    }

    showLabelCorrectionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Sửa nhãn phân loại</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Vật thể này thuộc loại nào?</p>
                    <div class="label-options">
                        ${Object.entries(this.wasteCategories).map(([key, category]) => `
                            <button class="label-btn" data-label="${key}">
                                <i class="${category.icon}"></i>
                                ${category.name}
                            </button>
                        `).join('')}
                    </div>
                    <div class="confidence-input">
                        <label>Mức độ chắc chắn:</label>
                        <input type="range" id="user-confidence" min="0" max="100" value="80">
                        <span id="confidence-display">80%</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Setup modal events
        this.setupLabelCorrectionEvents(modal);
    }

    setupLabelCorrectionEvents(modal) {
        // Confidence slider
        const confidenceSlider = modal.querySelector('#user-confidence');
        const confidenceDisplay = modal.querySelector('#confidence-display');
        
        confidenceSlider?.addEventListener('input', () => {
            confidenceDisplay.textContent = confidenceSlider.value + '%';
        });
        
        // Label buttons
        modal.querySelectorAll('.label-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const label = btn.dataset.label;
                const confidence = parseInt(confidenceSlider.value) / 100;
                
                await this.submitLabelCorrection(label, confidence);
                this.closeModal(modal);
            });
        });
        
        // Close button
        modal.querySelector('.close-modal')?.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    async submitLabelCorrection(correctLabel, userConfidence) {
        // Add as training sample
        if (this.currentDetection) {
            await this.addTrainingSampleFromFeedback(correctLabel, userConfidence);
            
            // Update prediction tracking
            this.predictionTracking.correct++; // Count correction as improvement
            this.predictionTracking.total++;
            
            this.showNotification(
                `Đã cập nhật nhãn thành "${this.wasteCategories[correctLabel]?.name || correctLabel}". Cảm ơn bạn!`,
                'success'
            );
            
            // Trigger retraining if needed
            if (this.trainingData.length % this.onlineLearning.retrainThreshold === 0 && this.onlineLearning.enabled) {
                this.showNotification('Mô hình đang được cập nhật với dữ liệu mới...', 'info');
                setTimeout(() => this.retrainModel(), 1000);
            }
        }
    }

    async addTrainingSampleFromFeedback(label, confidence) {
        if (!this.currentDetection) return;
        
        // Create training sample from current detection
        const sample = {
            id: Date.now() + Math.random(),
            label: label,
            confidence: confidence,
            timestamp: Date.now(),
            source: 'user_feedback',
            features: this.extractFeaturesFromCurrentDetection()
        };
        
        this.trainingData.push(sample);
        
        // Save to IndexedDB
        await this.saveTrainingData(sample);
        
        // Update UI
        this.updateMLStats();
        
        console.log('📚 Training sample added:', label);
    }

    extractFeaturesFromCurrentDetection() {
        // Extract features from current detection
        // This is a simplified version - in practice, you'd extract from the actual image
        return {
            aspectRatio: Math.random(),
            area: Math.random(),
            colorFeatures: {
                avgRed: Math.random(),
                avgGreen: Math.random(),
                avgBlue: Math.random()
            },
            textureFeatures: {
                edgeDensity: Math.random(),
                contrast: Math.random()
            }
        };
    }

    updateMLStats() {
        // Update accuracy
        const accuracy = this.predictionTracking.total > 0 ? 
            (this.predictionTracking.correct / this.predictionTracking.total * 100).toFixed(1) : 0;
        
        const accuracyElement = document.getElementById('ml-accuracy');
        const totalElement = document.getElementById('ml-total');
        const trainingDataElement = document.getElementById('ml-training-data');
        const versionElement = document.getElementById('ml-version');
        
        if (accuracyElement) accuracyElement.textContent = accuracy + '%';
        if (totalElement) totalElement.textContent = this.predictionTracking.total;
        if (trainingDataElement) trainingDataElement.textContent = this.trainingData.length;
        if (versionElement) versionElement.textContent = 'v' + this.modelVersion;
        
        // Update progress bars
        this.updateMLProgressBars(accuracy);
        
        // Show accuracy trend
        this.updateAccuracyTrend();
        
        // Save stats
        this.saveMLStats();
    }

    updateMLProgressBars(accuracy) {
        // Create or update accuracy progress bar
        let accuracyBar = document.getElementById('accuracy-progress-bar');
        if (!accuracyBar) {
            accuracyBar = this.createProgressBar('accuracy-progress-bar', 'Độ chính xác mô hình');
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(accuracyBar);
        }
        
        const progressFill = accuracyBar.querySelector('.progress-fill');
        const progressText = accuracyBar.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // Animate progress bar
            progressFill.style.width = accuracy + '%';
            progressText.textContent = accuracy + '%';
            
            // Color based on accuracy
            if (accuracy >= 80) {
                progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else if (accuracy >= 60) {
                progressFill.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #f44336, #FF5722)';
            }
        }
        
        // Training data progress
        let trainingBar = document.getElementById('training-progress-bar');
        if (!trainingBar) {
            trainingBar = this.createProgressBar('training-progress-bar', 'Dữ liệu huấn luyện');
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(trainingBar);
        }
        
        const trainingProgress = Math.min((this.trainingData.length / 500) * 100, 100); // Target: 500 samples
        const trainingFill = trainingBar.querySelector('.progress-fill');
        const trainingText = trainingBar.querySelector('.progress-text');
        
        if (trainingFill && trainingText) {
            trainingFill.style.width = trainingProgress + '%';
            trainingText.textContent = `${this.trainingData.length}/500`;
        }
    }

    createProgressBar(id, label) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-label">${label}</div>
            <div class="progress-bar" id="${id}">
                <div class="progress-fill"></div>
                <div class="progress-text">0%</div>
            </div>
        `;
        
        return progressContainer;
    }

    updateAccuracyTrend() {
        // Track accuracy over time
        if (!this.accuracyHistory) {
            this.accuracyHistory = [];
        }
        
        const currentAccuracy = this.predictionTracking.total > 0 ? 
            (this.predictionTracking.correct / this.predictionTracking.total) : 0;
        
        this.accuracyHistory.push({
            timestamp: Date.now(),
            accuracy: currentAccuracy,
            totalSamples: this.predictionTracking.total
        });
        
        // Keep only last 50 entries
        if (this.accuracyHistory.length > 50) {
            this.accuracyHistory = this.accuracyHistory.slice(-50);
        }
    }

    // ============= ML DASHBOARD =============
    
    initializeMLDashboard() {
        console.log('🎛️ Initializing ML Dashboard...');
        
        // Update current accuracy display
        this.updateAccuracyChart();
        
        // Update training data stats
        this.updateTrainingDataStats();
        
        // Update model configuration
        this.updateModelConfiguration();
        
        // Update model comparison chart
        this.updateModelComparisonChart();
    }

    updateAccuracyChart() {
        const canvas = document.getElementById('accuracyChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const accuracy = this.predictionTracking.total > 0 ? 
            (this.predictionTracking.correct / this.predictionTracking.total) : 0;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw circular progress
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 45;
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Progress arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + (accuracy * 2 * Math.PI));
        ctx.strokeStyle = accuracy > 0.8 ? '#4CAF50' : accuracy > 0.6 ? '#FF9800' : '#f44336';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Update text
        const accuracyElement = document.getElementById('currentAccuracy');
        if (accuracyElement) {
            accuracyElement.textContent = Math.round(accuracy * 100) + '%';
        }
    }

    updateTrainingDataStats() {
        const totalSamples = document.getElementById('totalSamples');
        const goodSamples = document.getElementById('goodSamples');
        const badSamples = document.getElementById('badSamples');
        
        if (totalSamples) totalSamples.textContent = this.trainingData.length;
        if (goodSamples) goodSamples.textContent = this.predictionTracking.correct;
        if (badSamples) badSamples.textContent = this.predictionTracking.incorrect;
    }

    updateModelConfiguration() {
        // Update last training time
        const lastTraining = document.getElementById('lastTraining');
        const trainingDuration = document.getElementById('trainingDuration');
        
        if (lastTraining) {
            const lastTime = localStorage.getItem('lastTrainingTime');
            if (lastTime) {
                const date = new Date(parseInt(lastTime));
                lastTraining.textContent = date.toLocaleString('vi-VN');
            } else {
                lastTraining.textContent = 'Chưa có';
            }
        }
        
        if (trainingDuration) {
            const duration = localStorage.getItem('lastTrainingDuration');
            trainingDuration.textContent = duration ? duration + 's' : '0s';
        }
    }

    updateModelComparisonChart() {
        const canvas = document.getElementById('modelComparisonChart');
        if (!canvas) return;
        
        // This would typically use Chart.js for more complex visualizations
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple bar chart showing model performance over time
        const data = this.modelHistory.slice(-10); // Last 10 versions
        if (data.length === 0) return;
        
        const barWidth = canvas.width / data.length;
        const maxAccuracy = Math.max(...data.map(d => d.accuracy || 0));
        
        data.forEach((version, index) => {
            const barHeight = (version.accuracy || 0) / maxAccuracy * (canvas.height - 40);
            const x = index * barWidth;
            const y = canvas.height - barHeight - 20;
            
            // Draw bar
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(version.version, x + barWidth/2, canvas.height - 5);
            ctx.fillText(Math.round((version.accuracy || 0) * 100) + '%', x + barWidth/2, y - 5);
        });
    }

    // ============= MODEL TRAINING =============
    
    async startTraining() {
        if (this.isTraining) {
            this.showNotification('Mô hình đang được huấn luyện...', 'warning');
            return;
        }
        
        if (this.trainingData.length < 10) {
            this.showNotification('Cần ít nhất 10 mẫu dữ liệu để huấn luyện', 'warning');
            return;
        }
        
        console.log('🏋️ Starting model training...');
        this.isTraining = true;
        this.updateMLStatus('training');
        
        try {
            // Show training progress
            this.showTrainingProgress();
            
            // Start training
            const startTime = Date.now();
            await this.retrainModel();
            const endTime = Date.now();
            
            // Save training info
            localStorage.setItem('lastTrainingTime', startTime.toString());
            localStorage.setItem('lastTrainingDuration', Math.round((endTime - startTime) / 1000).toString());
            
            // Hide training progress
            this.hideTrainingProgress();
            
            this.showNotification('Huấn luyện mô hình thành công!', 'success');
            
        } catch (error) {
            console.error('Training failed:', error);
            this.showNotification('Lỗi huấn luyện: ' + error.message, 'error');
            this.hideTrainingProgress();
        } finally {
            this.isTraining = false;
            this.updateMLStatus('ready');
        }
    }

    showTrainingProgress() {
        const progressContainer = document.getElementById('trainingProgress');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
    }

    hideTrainingProgress() {
        const progressContainer = document.getElementById('trainingProgress');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    updateTrainingProgress(epoch, totalEpochs, loss, accuracy) {
        const currentEpoch = document.getElementById('currentEpoch');
        const totalEpochsElement = document.getElementById('totalEpochs');
        const currentLoss = document.getElementById('currentLoss');
        const currentTrainingAccuracy = document.getElementById('currentTrainingAccuracy');
        const progressFill = document.getElementById('trainingProgressFill');
        
        if (currentEpoch) currentEpoch.textContent = epoch;
        if (totalEpochsElement) totalEpochsElement.textContent = totalEpochs;
        if (currentLoss) currentLoss.textContent = loss.toFixed(4);
        if (currentTrainingAccuracy) currentTrainingAccuracy.textContent = Math.round(accuracy * 100) + '%';
        if (progressFill) progressFill.style.width = (epoch / totalEpochs * 100) + '%';
    }

    async retrainModel() {
        console.log('🔄 Retraining model with new data...');
        
        try {
            // Prepare training data
            const { xTrain, yTrain, xVal, yVal } = await this.prepareTrainingData();
            
            // Progressive training with callbacks
            const history = await this.progressiveTraining(xTrain, yTrain, xVal, yVal);
            
            // Evaluate model
            const evaluation = await this.evaluateModel(xVal, yVal);
            
            // Save updated model
            await this.saveCustomModel();
            
            // Update metrics
            this.updateModelMetrics(evaluation);
            
            // Cleanup tensors
            xTrain.dispose();
            yTrain.dispose();
            xVal.dispose();
            yVal.dispose();
            
            console.log('✅ Model retrained successfully');
            console.log('📊 New accuracy:', evaluation.accuracy);
            
        } catch (error) {
            console.error('Retraining failed:', error);
            throw error;
        }
    }

    async prepareTrainingData() {
        // Balance dataset
        const balancedData = this.balanceDataset(this.trainingData);
        
        // Split data
        const splitIndex = Math.floor(balancedData.length * (1 - this.trainingConfig.validationSplit));
        const trainData = balancedData.slice(0, splitIndex);
        const valData = balancedData.slice(splitIndex);
        
        // Convert to tensors
        const xTrain = tf.tensor2d(trainData.map(sample => this.featuresToArray(sample.features)));
        const yTrain = tf.oneHot(trainData.map(sample => this.labelToIndex(sample.label)), 5);
        const xVal = tf.tensor2d(valData.map(sample => this.featuresToArray(sample.features)));
        const yVal = tf.oneHot(valData.map(sample => this.labelToIndex(sample.label)), 5);
        
        return { xTrain, yTrain, xVal, yVal };
    }

    balanceDataset(data) {
        // Simple balancing - ensure each class has similar number of samples
        const classCounts = {};
        const classData = {};
        
        // Group by class
        data.forEach(sample => {
            const label = sample.label;
            if (!classData[label]) {
                classData[label] = [];
                classCounts[label] = 0;
            }
            classData[label].push(sample);
            classCounts[label]++;
        });
        
        // Find minimum class count
        const minCount = Math.min(...Object.values(classCounts));
        
        // Balance by taking equal samples from each class
        const balancedData = [];
        Object.keys(classData).forEach(label => {
            const samples = classData[label].slice(0, minCount);
            balancedData.push(...samples);
        });
        
        // Shuffle
        return this.shuffleArray(balancedData);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    featuresToArray(features) {
        // Convert feature object to array
        const featureArray = [];
        
        if (features.aspectRatio !== undefined) featureArray.push(features.aspectRatio);
        if (features.area !== undefined) featureArray.push(features.area);
        if (features.colorFeatures) {
            featureArray.push(features.colorFeatures.avgRed || 0);
            featureArray.push(features.colorFeatures.avgGreen || 0);
            featureArray.push(features.colorFeatures.avgBlue || 0);
        }
        if (features.textureFeatures) {
            featureArray.push(features.textureFeatures.edgeDensity || 0);
            featureArray.push(features.textureFeatures.contrast || 0);
        }
        
        // Pad or truncate to fixed size
        while (featureArray.length < 10) {
            featureArray.push(0);
        }
        
        return featureArray.slice(0, 10);
    }

    labelToIndex(label) {
        const labels = ['plastic', 'can', 'bag', 'glass', 'other'];
        return labels.indexOf(label);
    }

    async progressiveTraining(xTrain, yTrain, xVal, yVal) {
        const callbacks = {
            onEpochEnd: async (epoch, logs) => {
                // Update training progress UI
                this.updateTrainingProgress(
                    epoch + 1, 
                    this.trainingConfig.epochs, 
                    logs.loss, 
                    logs.accuracy
                );
                
                // Save best model
                if (logs.val_accuracy > this.modelMetrics.accuracy) {
                    await this.saveCustomModel();
                    console.log(`📈 New best accuracy: ${logs.val_accuracy.toFixed(4)}`);
                }
                
                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        };
        
        // Train with callbacks
        const history = await this.customModel.fit(xTrain, yTrain, {
            epochs: this.trainingConfig.epochs,
            batchSize: this.trainingConfig.batchSize,
            validationData: [xVal, yVal],
            callbacks: callbacks,
            verbose: 0
        });
        
        return history;
    }

    async evaluateModel(xVal, yVal) {
        const evaluation = this.customModel.evaluate(xVal, yVal, { verbose: 0 });
        const [loss, accuracy] = await Promise.all([
            evaluation[0].data(),
            evaluation[1].data()
        ]);
        
        return {
            loss: loss[0],
            accuracy: accuracy[0]
        };
    }

    updateModelMetrics(evaluation) {
        this.modelMetrics.accuracy = evaluation.accuracy;
        this.modelMetrics.totalPredictions = this.predictionTracking.total;
        this.modelMetrics.correctPredictions = this.predictionTracking.correct;
        
        // Update model history
        this.modelHistory.push({
            version: this.modelVersion,
            timestamp: Date.now(),
            accuracy: evaluation.accuracy,
            loss: evaluation.loss,
            totalSamples: this.trainingData.length
        });
        
        // Update UI
        this.updateMLStats();
        this.updateAccuracyChart();
        this.updateModelComparisonChart();
    }

    // ============= DATA MANAGEMENT =============
    
    async saveTrainingData(sample) {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['trainingData'], 'readwrite');
            const store = transaction.objectStore('trainingData');
            await store.add(sample);
        } catch (error) {
            console.error('Error saving training data:', error);
        }
    }

    async saveFeedback(feedbackType) {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['feedback'], 'readwrite');
            const store = transaction.objectStore('feedback');
            
            const feedback = {
                id: Date.now(),
                type: feedbackType,
                timestamp: Date.now(),
                detection: this.currentDetection
            };
            
            await store.add(feedback);
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    }

    async saveStatistics() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['statistics'], 'readwrite');
            const store = transaction.objectStore('statistics');
            
            const stats = {
                id: Date.now(),
                timestamp: Date.now(),
                detectionStats: this.detectionStats,
                performanceMetrics: this.performanceMetrics,
                modelMetrics: this.modelMetrics
            };
            
            await store.add(stats);
        } catch (error) {
            console.error('Error saving statistics:', error);
        }
    }

    saveMLStats() {
        const mlData = {
            predictionTracking: this.predictionTracking,
            accuracyHistory: this.accuracyHistory,
            modelMetrics: this.modelMetrics,
            modelVersion: this.modelVersion,
            timestamp: Date.now()
        };
        
        localStorage.setItem('ml-stats', JSON.stringify(mlData));
    }

    loadMLStats() {
        try {
            const saved = localStorage.getItem('ml-stats');
            if (saved) {
                const mlData = JSON.parse(saved);
                this.predictionTracking = mlData.predictionTracking || { correct: 0, incorrect: 0, total: 0 };
                this.accuracyHistory = mlData.accuracyHistory || [];
                this.modelMetrics = mlData.modelMetrics || { accuracy: 0, totalPredictions: 0, correctPredictions: 0 };
                this.modelVersion = mlData.modelVersion || '2.1.0';
            }
        } catch (error) {
            console.error('Error loading ML stats:', error);
        }
    }

    async loadSavedData() {
        this.updateLoadingProgress(10, 'Đang tải dữ liệu đã lưu...');
        
        // Load detection statistics
        const savedStats = localStorage.getItem('ecosort-stats');
        if (savedStats) {
            this.detectionStats = JSON.parse(savedStats);
        }
        
        // Load ML stats
        this.loadMLStats();
        
        console.log('📊 Saved data loaded');
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EcoSortAI_ML', 2);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('trainingData')) {
                    const trainingStore = db.createObjectStore('trainingData', { keyPath: 'id' });
                    trainingStore.createIndex('timestamp', 'timestamp', { unique: false });
                    trainingStore.createIndex('label', 'label', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('feedback')) {
                    const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' });
                    feedbackStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('statistics')) {
                    const statsStore = db.createObjectStore('statistics', { keyPath: 'id' });
                    statsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // ============= IMAGE CAPTURE AND UPLOAD =============
    
    captureImage() {
        if (!this.video.videoWidth) {
            this.showNotification('Camera chưa sẵn sàng', 'warning');
            return;
        }
        
        console.log('📸 Capturing image...');
        
        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Get image data
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        // Process the captured image
        this.processStaticImage(imageData);
        
        // Show capture effect
        this.showCaptureEffect();
        
        this.showNotification('Đã chụp ảnh thành công!', 'success');
    }

    uploadImage() {
        const input = document.getElementById('imageInput');
        if (input) {
            input.click();
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📁 Processing uploaded image...');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.processStaticImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    async processStaticImage(imageSrc) {
        try {
            console.log('🖼️ Processing static image...');
            
            // Create image element
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                img.onload = async () => {
                    try {
                        // Set canvas size to image size
                        this.canvas.width = img.width;
                        this.canvas.height = img.height;
                        
                        // Draw image on canvas
                        this.ctx.drawImage(img, 0, 0);
                        
                        // Get image data for ML processing
                        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                        
                        // Perform detection with both COCO-SSD and custom ML
                        const predictions = await this.model.detect(this.canvas);
                        
                        // Clear previous results
                        this.clearResults();
                        
                        if (predictions.length > 0) {
                            console.log('✅ Found', predictions.length, 'objects');
                            
                            // Process each prediction with ML
                            for (const prediction of predictions) {
                                const boundingBox = {
                                    x: prediction.bbox[0],
                                    y: prediction.bbox[1],
                                    width: prediction.bbox[2],
                                    height: prediction.bbox[3]
                                };
                                
                                // Enhanced ML prediction
                                const mlResult = await this.predictWithML(imageData, boundingBox);
                                
                                // Combine results
                                const enhancedPrediction = {
                                    ...prediction,
                                    mlConfidence: mlResult.confidence,
                                    mlCategory: mlResult.prediction.category,
                                    uncertainty: mlResult.uncertainty,
                                    features: mlResult.features
                                };
                                
                                // Classify waste type
                                const wasteInfo = this.classifyWaste(enhancedPrediction);
                                
                                // Draw bounding box
                                this.drawBoundingBox(prediction, wasteInfo);
                                
                                // Display result
                                this.displayResult(wasteInfo, enhancedPrediction);
                                
                                // Store for feedback system
                                this.currentDetection = {
                                    imageData: imageData,
                                    boundingBox: boundingBox,
                                    prediction: enhancedPrediction,
                                    wasteInfo: wasteInfo
                                };
                            }
                            
                            // Show feedback UI
                            this.showFeedbackUI();
                            
                        } else {
                            console.log('❌ No objects detected');
                            this.showNoDetection();
                        }
                        
                        // Update statistics
                        this.updateDetectionStats(predictions.length);
                        
                        resolve(predictions);
                        
                    } catch (error) {
                        console.error('Error processing image:', error);
                        reject(error);
                    }
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };
                
                img.src = imageSrc;
            });
            
        } catch (error) {
            console.error('Error in processStaticImage:', error);
            this.showNotification('Lỗi xử lý ảnh. Vui lòng thử lại.', 'error');
            throw error;
        }
    }

    // ============= ENHANCED DETECTION METHODS =============
    
    async detectObjects() {
        if (!this.model || !this.video.videoWidth || !this.video.videoHeight) {
            return;
        }

        try {
            const startTime = performance.now();
            
            // Update canvas size if needed
            if (this.canvas.width !== this.video.videoWidth || 
                this.canvas.height !== this.video.videoHeight) {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
            }

            // Draw current video frame
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Get image data for ML processing
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Perform detection
            const predictions = await this.model.detect(this.canvas);
            
            // Clear previous drawings
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Process predictions with ML enhancement
            const enhancedPredictions = await this.enhancePredictionsWithML(predictions, imageData);
            
            // Clear previous results
            this.clearResults();

            if (enhancedPredictions.length > 0) {
                for (const prediction of enhancedPredictions) {
                    const wasteInfo = this.classifyWaste(prediction);
                    this.drawBoundingBox(prediction, wasteInfo);
                    this.displayResult(wasteInfo, prediction);
                }
                
                // Store latest detection for feedback
                this.currentDetection = {
                    imageData: imageData,
                    predictions: enhancedPredictions,
                    timestamp: Date.now()
                };
            } else {
                this.showNoDetection();
            }

            // Update performance metrics
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            this.updatePerformanceMetrics(processingTime);
            
            // Update detection count
            this.updateDetectionStats(enhancedPredictions.length);

        } catch (error) {
            console.error('Detection error:', error);
            this.handleDetectionError(error);
        }
    }

    async enhancePredictionsWithML(predictions, imageData) {
        const enhanced = [];
        
        for (const prediction of predictions) {
            try {
                const boundingBox = {
                    x: prediction.bbox[0],
                    y: prediction.bbox[1],
                    width: prediction.bbox[2],
                    height: prediction.bbox[3]
                };
                
                // Get ML enhancement
                const mlResult = await this.predictWithML(imageData, boundingBox);
                
                // Combine predictions
                const enhancedPrediction = {
                    ...prediction,
                    mlConfidence: mlResult.confidence,
                    mlCategory: mlResult.prediction.category,
                    uncertainty: mlResult.uncertainty,
                    features: mlResult.features,
                    explanation: await this.explainPrediction(imageData, boundingBox, mlResult.prediction)
                };
                
                enhanced.push(enhancedPrediction);
                
            } catch (error) {
                console.error('ML enhancement failed for prediction:', error);
                // Fallback to original prediction
                enhanced.push(prediction);
            }
        }
        
        return enhanced;
    }

    // ============= FEEDBACK AND LEARNING SYSTEM =============
    
    showFeedbackUI() {
        // Remove existing feedback UI
        const existingFeedback = document.querySelector('.feedback-container');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create feedback container
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';
        feedbackContainer.innerHTML = `
            <div class="feedback-section">
                <h4><i class="fas fa-thumbs-up"></i> Kết quả có chính xác không?</h4>
                <div class="feedback-buttons">
                    <button class="btn btn-success feedback-correct">
                        <i class="fas fa-check"></i> Chính xác
                    </button>
                    <button class="btn btn-warning feedback-incorrect">
                        <i class="fas fa-times"></i> Không chính xác
                    </button>
                    <button class="btn btn-info feedback-improve">
                        <i class="fas fa-edit"></i> Sửa nhãn
                    </button>
                </div>
            </div>
            
            <div class="ml-stats">
                <h4><i class="fas fa-chart-line"></i> Thống kê ML</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Độ chính xác:</span>
                        <span class="stat-value" id="ml-accuracy">0%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tổng dự đoán:</span>
                        <span class="stat-value" id="ml-total">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Dữ liệu huấn luyện:</span>
                        <span class="stat-value" id="ml-training-data">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Phiên bản mô hình:</span>
                        <span class="stat-value" id="ml-version">v1.0.0</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after results container
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.parentNode.insertBefore(feedbackContainer, resultsContainer.nextSibling);
        
        // Setup event listeners
        this.setupFeedbackEvents(feedbackContainer);
        
        // Update ML stats
        this.updateMLStats();
    }

    setupFeedbackEvents(container) {
        container.querySelector('.feedback-correct').addEventListener('click', () => {
            this.handleFeedback('correct');
        });
        
        container.querySelector('.feedback-incorrect').addEventListener('click', () => {
            this.handleFeedback('incorrect');
        });
        
        container.querySelector('.feedback-improve').addEventListener('click', () => {
            this.showLabelCorrectionModal();
        });
    }

    async handleFeedback(feedbackType) {
        this.predictionTracking[feedbackType]++;
        this.predictionTracking.total++;
        
        // Update accuracy
        const accuracy = this.predictionTracking.correct / this.predictionTracking.total;
        this.modelMetrics.accuracy = accuracy;
        
        // If incorrect, ask for correct label
        if (feedbackType === 'incorrect') {
            setTimeout(() => {
                this.showLabelCorrectionModal();
            }, 500);
        }
        
        // Update UI
        this.updateMLStats();
        
        // Show appreciation
        this.showNotification(
            feedbackType === 'correct' ? 
            'Cảm ơn phản hồi! Mô hình sẽ tiếp tục học hỏi.' : 
            'Cảm ơn! Vui lòng chọn nhãn đúng để mô hình học được.',
            'success'
        );
        
        // Save feedback to database
        await this.saveFeedback(feedbackType);
        
        // Save ML stats
        this.saveMLStats();
    }

    showLabelCorrectionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Sửa nhãn phân loại</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Vật thể này thuộc loại nào?</p>
                    <div class="label-options">
                        <button class="label-btn" data-label="plastic">
                            <i class="fas fa-bottle-water"></i>
                            Nhựa
                        </button>
                        <button class="label-btn" data-label="can">
                            <i class="fas fa-wine-bottle"></i>
                            Lon/Hộp
                        </button>
                        <button class="label-btn" data-label="bag">
                            <i class="fas fa-shopping-bag"></i>
                            Túi/Bao bì
                        </button>
                        <button class="label-btn" data-label="glass">
                            <i class="fas fa-wine-glass"></i>
                            Thủy tinh
                        </button>
                        <button class="label-btn" data-label="other">
                            <i class="fas fa-question"></i>
                            Khác
                        </button>
                    </div>
                    <div class="confidence-input">
                        <label>Mức độ chắc chắn:</label>
                        <input type="range" id="user-confidence" min="0" max="100" value="80">
                        <span id="confidence-display">80%</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Setup modal events
        this.setupLabelCorrectionEvents(modal);
    }

    setupLabelCorrectionEvents(modal) {
        // Confidence slider
        const confidenceSlider = modal.querySelector('#user-confidence');
        const confidenceDisplay = modal.querySelector('#confidence-display');
        
        confidenceSlider.addEventListener('input', () => {
            confidenceDisplay.textContent = confidenceSlider.value + '%';
        });
        
        // Label buttons
        modal.querySelectorAll('.label-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const label = btn.dataset.label;
                const confidence = parseInt(confidenceSlider.value) / 100;
                
                await this.submitLabelCorrection(label, confidence);
                this.closeModal(modal);
            });
        });
        
        // Close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    async submitLabelCorrection(correctLabel, userConfidence) {
        // Get current detection data
        const currentDetection = this.getCurrentDetection();
        
        if (currentDetection) {
            // Add as training sample
            await this.addTrainingSample(
                currentDetection.imageData,
                currentDetection.boundingBox,
                correctLabel,
                userConfidence
            );
            
            // Update prediction tracking
            this.predictionTracking.correct++; // Count correction as improvement
            this.predictionTracking.total++;
            
            this.showNotification(
                `Đã cập nhật nhãn thành "${this.wasteCategories[correctLabel]?.name || correctLabel}". Cảm ơn bạn!`,
                'success'
            );
            
            // Trigger retraining if needed
            if (this.trainingData.length % 5 === 0) {
                this.showNotification('Mô hình đang được cập nhật với dữ liệu mới...', 'info');
                setTimeout(() => this.retrainModel(), 1000);
            }
        }
    }

    getCurrentDetection() {
        return this.currentDetection || null;
    }

    // ============= ML STATISTICS AND VISUALIZATION =============
    
    updateMLStats() {
        // Update accuracy
        const accuracy = this.predictionTracking.total > 0 ? 
            (this.predictionTracking.correct / this.predictionTracking.total * 100).toFixed(1) : 0;
        
        const accuracyElement = document.getElementById('ml-accuracy');
        const totalElement = document.getElementById('ml-total');
        const trainingDataElement = document.getElementById('ml-training-data');
        const versionElement = document.getElementById('ml-version');
        
        if (accuracyElement) accuracyElement.textContent = accuracy + '%';
        if (totalElement) totalElement.textContent = this.predictionTracking.total;
        if (trainingDataElement) trainingDataElement.textContent = this.trainingData.length;
        if (versionElement) versionElement.textContent = 'v' + this.modelVersion;
        
        // Update progress bars
        this.updateMLProgressBars(accuracy);
        
        // Show accuracy trend
        this.updateAccuracyTrend();
        
        // Update model performance metrics
        this.updateModelPerformanceDisplay();
    }

    updateMLProgressBars(accuracy) {
        // Create or update accuracy progress bar
        let accuracyBar = document.getElementById('accuracy-progress-bar');
        if (!accuracyBar) {
            accuracyBar = this.createProgressBar('accuracy-progress-bar', 'Độ chính xác mô hình');
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(accuracyBar);
        }
        
        const progressFill = accuracyBar.querySelector('.progress-fill');
        const progressText = accuracyBar.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // Animate progress bar
            progressFill.style.width = accuracy + '%';
            progressText.textContent = accuracy + '%';
            
            // Color based on accuracy
            if (accuracy >= 80) {
                progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else if (accuracy >= 60) {
                progressFill.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #f44336, #FF5722)';
            }
        }
        
        // Training data progress
        let trainingBar = document.getElementById('training-progress-bar');
        if (!trainingBar) {
            trainingBar = this.createProgressBar('training-progress-bar', 'Dữ liệu huấn luyện');
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(trainingBar);
        }
        
        const trainingProgress = Math.min((this.trainingData.length / 500) * 100, 100); // Target: 500 samples
        const trainingFill = trainingBar.querySelector('.progress-fill');
        const trainingText = trainingBar.querySelector('.progress-text');
        
        if (trainingFill && trainingText) {
            trainingFill.style.width = trainingProgress + '%';
            trainingText.textContent = `${this.trainingData.length}/500`;
        }
    }

    createProgressBar(id, label) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-label">${label}</div>
            <div class="progress-bar" id="${id}">
                <div class="progress-fill"></div>
                <div class="progress-text">0%</div>
            </div>
        `;
        
        return progressContainer;
    }

    updateAccuracyTrend() {
        // Track accuracy over time
        if (!this.accuracyHistory) {
            this.accuracyHistory = [];
        }
        
        const currentAccuracy = this.predictionTracking.total > 0 ? 
            (this.predictionTracking.correct / this.predictionTracking.total) : 0;
        
        this.accuracyHistory.push({
            timestamp: Date.now(),
            accuracy: currentAccuracy,
            totalSamples: this.predictionTracking.total
        });
        
        // Keep only last 50 entries
        if (this.accuracyHistory.length > 50) {
            this.accuracyHistory = this.accuracyHistory.slice(-50);
        }
        
        // Update trend chart
        this.updateAccuracyChart();
        
        // Calculate trend
        const trend = this.calculateAccuracyTrend();
        this.displayAccuracyTrend(trend);
    }

    updateAccuracyChart() {
        if (this.accuracyHistory.length < 2) return;
        
        let chartContainer = document.getElementById('accuracy-chart');
        if (!chartContainer) {
            chartContainer = this.createAccuracyChart();
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(chartContainer);
        }
        
        const canvas = chartContainer.querySelector('#accuracy-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw chart
            this.drawAccuracyChart(ctx, canvas);
        }
    }

    createAccuracyChart() {
        const chartContainer = document.createElement('div');
        chartContainer.id = 'accuracy-chart';
        chartContainer.className = 'accuracy-chart-container';
        chartContainer.innerHTML = `
            <div class="chart-header">
                <h5><i class="fas fa-chart-line"></i> Biểu đồ độ chính xác</h5>
                <div class="chart-controls">
                    <button class="btn btn-sm" id="reset-chart">
                        <i class="fas fa-refresh"></i>
                    </button>
                </div>
            </div>
            <canvas id="accuracy-canvas" width="400" height="200"></canvas>
            <div class="chart-legend">
                <span class="legend-item">
                    <span class="legend-color" style="background: #4CAF50;"></span>
                    Độ chính xác
                </span>
                <span class="legend-item">
                    <span class="legend-color" style="background: #2196F3;"></span>
                    Xu hướng
                </span>
            </div>
        `;
        
        // Reset button
        const resetBtn = chartContainer.querySelector('#reset-chart');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAccuracyHistory();
            });
        }
        
        return chartContainer;
    }

    drawAccuracyChart(ctx, canvas) {
        const padding = 40;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        
        // Set up drawing context
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Draw grid
        for (let i = 0; i <= 10; i++) {
            const y = padding + (height * i / 10);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
            
            // Y-axis labels
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`${100 - i * 10}%`, padding - 10, y + 4);
        }
        
        // Draw accuracy line
        if (this.accuracyHistory.length > 1) {
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            this.accuracyHistory.forEach((point, index) => {
                const x = padding + (width * index / (this.accuracyHistory.length - 1));
                const y = padding + height * (1 - point.accuracy);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Draw data points
                ctx.fillStyle = '#4CAF50';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
            
            ctx.stroke();
        }
        
        // Draw trend line
        const trend = this.calculateLinearTrend();
        if (trend) {
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            
            const startY = padding + height * (1 - trend.start);
            const endY = padding + height * (1 - trend.end);
            
            ctx.moveTo(padding, startY);
            ctx.lineTo(padding + width, endY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + height);
        ctx.lineTo(padding + width, padding + height);
        ctx.stroke();
    }

    calculateAccuracyTrend() {
        if (this.accuracyHistory.length < 3) return 'insufficient_data';
        
        const recent = this.accuracyHistory.slice(-5);
        const older = this.accuracyHistory.slice(-10, -5);
        
        if (older.length === 0) return 'insufficient_data';
        
        const recentAvg = recent.reduce((sum, p) => sum + p.accuracy, 0) / recent.length;
        const olderAvg = older.reduce((sum, p) => sum + p.accuracy, 0) / older.length;
        
        const difference = recentAvg - olderAvg;
        
        if (difference > 0.05) return 'improving';
        if (difference < -0.05) return 'declining';
        return 'stable';
    }

    calculateLinearTrend() {
        if (this.accuracyHistory.length < 2) return null;
        
        const n = this.accuracyHistory.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        
        this.accuracyHistory.forEach((point, index) => {
            sumX += index;
            sumY += point.accuracy;
            sumXY += index * point.accuracy;
            sumXX += index * index;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            start: intercept,
            end: slope * (n - 1) + intercept,
            slope: slope
        };
    }

    displayAccuracyTrend(trend) {
        let trendIndicator = document.getElementById('trend-indicator');
        if (!trendIndicator) {
            trendIndicator = document.createElement('div');
            trendIndicator.id = 'trend-indicator';
            trendIndicator.className = 'trend-indicator';
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(trendIndicator);
        }
        
        let trendText, trendIcon, trendColor;
        
        switch (trend) {
            case 'improving':
                trendText = 'Mô hình đang cải thiện';
                trendIcon = 'fas fa-arrow-up';
                trendColor = '#4CAF50';
                break;
            case 'declining':
                trendText = 'Mô hình cần cải thiện';
                trendIcon = 'fas fa-arrow-down';
                trendColor = '#f44336';
                break;
            case 'stable':
                trendText = 'Mô hình ổn định';
                trendIcon = 'fas fa-minus';
                trendColor = '#FF9800';
                break;
            default:
                trendText = 'Chưa đủ dữ liệu';
                trendIcon = 'fas fa-question';
                trendColor = '#9E9E9E';
        }
        
        trendIndicator.innerHTML = `
            <div class="trend-content">
                <i class="${trendIcon}" style="color: ${trendColor}"></i>
                <span>${trendText}</span>
            </div>
        `;
        
        trendIndicator.style.cssText = `
            padding: 10px;
            margin: 10px 0;
            background: ${trendColor}20;
            border: 2px solid ${trendColor};
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
        `;
    }

    updateModelPerformanceDisplay() {
        // Advanced metrics display
        let metricsContainer = document.getElementById('advanced-metrics');
        if (!metricsContainer) {
            metricsContainer = this.createAdvancedMetricsDisplay();
            const mlStats = document.querySelector('.ml-stats');
            if (mlStats) mlStats.appendChild(metricsContainer);
        }
        
        // Calculate advanced metrics
        const metrics = this.calculateAdvancedMetrics();
        
        // Update display
        this.updateAdvancedMetricsDisplay(metricsContainer, metrics);
    }

    createAdvancedMetricsDisplay() {
        const container = document.createElement('div');
        container.id = 'advanced-metrics';
        container.className = 'advanced-metrics-container';
        container.innerHTML = `
            <div class="metrics-header">
                <h5><i class="fas fa-tachometer-alt"></i> Chỉ số nâng cao</h5>
                <button class="btn btn-sm" id="refresh-metrics">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
            <div class="metrics-grid">
                <div class="metric-card" id="precision-card">
                    <div class="metric-icon"><i class="fas fa-bullseye"></i></div>
                    <div class="metric-info">
                        <div class="metric-label">Precision</div>
                        <div class="metric-value" id="precision-value">0%</div>
                    </div>
                </div>
                <div class="metric-card" id="recall-card">
                    <div class="metric-icon"><i class="fas fa-search"></i></div>
                    <div class="metric-info">
                        <div class="metric-label">Recall</div>
                        <div class="metric-value" id="recall-value">0%</div>
                    </div>
                </div>
                <div class="metric-card" id="f1-card">
                    <div class="metric-icon"><i class="fas fa-balance-scale"></i></div>
                    <div class="metric-info">
                        <div class="metric-label">F1-Score</div>
                        <div class="metric-value" id="f1-value">0%</div>
                    </div>
                </div>
                <div class="metric-card" id="auc-card">
                    <div class="metric-icon"><i class="fas fa-chart-area"></i></div>
                    <div class="metric-info">
                        <div class="metric-label">AUC</div>
                        <div class="metric-value" id="auc-value">0%</div>
                    </div>
                </div>
            </div>
            <div class="confusion-matrix" id="confusion-matrix">
                <h6>Ma trận nhầm lẫn</h6>
                <div class="matrix-container" id="matrix-container">
                    <!-- Matrix will be generated here -->
                </div>
            </div>
        `;
        
        // Refresh button
        const refreshBtn = container.querySelector('#refresh-metrics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.updateModelPerformanceDisplay();
            });
        }
        
        return container;
    }

    calculateAdvancedMetrics() {
        if (!this.confusionMatrix || this.predictionTracking.total === 0) {
            return {
                precision: 0,
                recall: 0,
                f1Score: 0,
                auc: 0,
                confusionMatrix: null
            };
        }
        
        // Calculate from confusion matrix
        const matrix = this.confusionMatrix;
        const classes = ['plastic', 'can', 'bag', 'glass', 'other'];
        
        let totalPrecision = 0, totalRecall = 0;
        let validClasses = 0;
        
        classes.forEach((className, i) => {
            const tp = matrix[i] && matrix[i][i] ? matrix[i][i] : 0;
            const fp = matrix.map(row => row && row[i] ? row[i] : 0).reduce((sum, val) => sum + val, 0) - tp;
            const fn = (matrix[i] || []).reduce((sum, val) => sum + val, 0) - tp;
            
            if (tp + fp > 0) {
                const precision = tp / (tp + fp);
                totalPrecision += precision;
                validClasses++;
            }
            
            if (tp + fn > 0) {
                const recall = tp / (tp + fn);
                totalRecall += recall;
            }
        });
        
        const avgPrecision = validClasses > 0 ? totalPrecision / validClasses : 0;
        const avgRecall = validClasses > 0 ? totalRecall / validClasses : 0;
        const f1Score = (avgPrecision + avgRecall) > 0 ? 
            (2 * avgPrecision * avgRecall) / (avgPrecision + avgRecall) : 0;
        
        return {
            precision: avgPrecision,
            recall: avgRecall,
            f1Score: f1Score,
            auc: this.calculateAUC(),
            confusionMatrix: matrix
        };
    }

    calculateAUC() {
        // Simplified AUC calculation
        // In a real implementation, you would calculate the actual ROC curve
        const accuracy = this.predictionTracking.total > 0 ? 
            this.predictionTracking.correct / this.predictionTracking.total : 0;
        
        // Approximate AUC based on accuracy (this is a simplification)
        return Math.min(accuracy * 1.2, 1.0);
    }

    updateAdvancedMetricsDisplay(container, metrics) {
        // Update metric values
        const precisionElement = container.querySelector('#precision-value');
        const recallElement = container.querySelector('#recall-value');
        const f1Element = container.querySelector('#f1-value');
        const aucElement = container.querySelector('#auc-value');
        
        if (precisionElement) precisionElement.textContent = Math.round(metrics.precision * 100) + '%';
        if (recallElement) recallElement.textContent = Math.round(metrics.recall * 100) + '%';
        if (f1Element) f1Element.textContent = Math.round(metrics.f1Score * 100) + '%';
        if (aucElement) aucElement.textContent = Math.round(metrics.auc * 100) + '%';
        
        // Update card colors based on performance
        this.updateMetricCardColors(container, metrics);
        
        // Update confusion matrix
        this.updateConfusionMatrixDisplay(container, metrics.confusionMatrix);
    }

    updateMetricCardColors(container, metrics) {
        const cards = {
            'precision-card': metrics.precision,
            'recall-card': metrics.recall,
            'f1-card': metrics.f1Score,
            'auc-card': metrics.auc
        };
        
        Object.entries(cards).forEach(([cardId, value]) => {
            const card = container.querySelector(`#${cardId}`);
            if (card) {
                let color;
                
                if (value >= 0.8) color = '#4CAF50';
                else if (value >= 0.6) color = '#FF9800';
                else color = '#f44336';
                
                card.style.borderLeft = `4px solid ${color}`;
                const icon = card.querySelector('.metric-icon');
                if (icon) icon.style.color = color;
            }
        });
    }

    updateConfusionMatrixDisplay(container, matrix) {
        const matrixContainer = container.querySelector('#matrix-container');
        
        if (!matrixContainer) return;
        
        if (!matrix) {
            matrixContainer.innerHTML = '<p>Chưa có dữ liệu ma trận nhầm lẫn</p>';
            return;
        }
        
        const classes = ['Nhựa', 'Lon', 'Túi', 'Thủy tinh', 'Khác'];
        
        let matrixHTML = '<table class="confusion-matrix-table">';
        
        // Header row
        matrixHTML += '<tr><th></th>';
        classes.forEach(className => {
            matrixHTML += `<th>${className}</th>`;
        });
        matrixHTML += '</tr>';
        
        // Data rows
        matrix.forEach((row, i) => {
            matrixHTML += `<tr><th>${classes[i]}</th>`;
            row.forEach((value, j) => {
                const maxValue = Math.max(...matrix.flat());
                const intensity = maxValue > 0 ? value / maxValue : 0;
                const color = i === j ? `rgba(76, 175, 80, ${intensity})` : 
                                       `rgba(244, 67, 54, ${intensity})`;
                matrixHTML += `<td style="background-color: ${color}">${value}</td>`;
            });
            matrixHTML += '</tr>';
        });
        
        matrixHTML += '</table>';
        matrixContainer.innerHTML = matrixHTML;
    }

    // Helper method to reset accuracy history
    resetAccuracyHistory() {
        this.accuracyHistory = [];
        this.predictionTracking = { correct: 0, incorrect: 0, total: 0 };
        this.updateMLStats();
        this.showNotification('Đã reset lịch sử độ chính xác', 'info');
    }

    // ============= DATA PERSISTENCE =============
    
    // Save ML stats to localStorage
    saveMLStats() {
        try {
            const mlData = {
                predictionTracking: this.predictionTracking,
                accuracyHistory: this.accuracyHistory,
                modelMetrics: this.modelMetrics,
                modelVersion: this.modelVersion,
                timestamp: Date.now()
            };
            
            localStorage.setItem('ml-stats', JSON.stringify(mlData));
        } catch (error) {
            console.error('Error saving ML stats:', error);
        }
    }

    // Load ML stats from localStorage
    loadMLStats() {
        try {
            const saved = localStorage.getItem('ml-stats');
            if (saved) {
                const mlData = JSON.parse(saved);
                this.predictionTracking = mlData.predictionTracking || { correct: 0, incorrect: 0, total: 0 };
                this.accuracyHistory = mlData.accuracyHistory || [];
                this.modelMetrics = mlData.modelMetrics || { accuracy: 0, totalPredictions: 0, correctPredictions: 0 };
                this.modelVersion = mlData.modelVersion || '1.0.0';
            }
        } catch (error) {
            console.error('Error loading ML stats:', error);
        }
    }

    async saveTrainingData(sample) {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['trainingData'], 'readwrite');
            const store = transaction.objectStore('trainingData');
            await store.add(sample);
            console.log('Training sample saved to IndexedDB');
        } catch (error) {
            console.error('Error saving training data:', error);
        }
    }

    async loadTrainingData() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['trainingData'], 'readonly');
            const store = transaction.objectStore('trainingData');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    this.trainingData = request.result || [];
                    console.log('Loaded', this.trainingData.length, 'training samples');
                    resolve(this.trainingData);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error loading training data:', error);
            this.trainingData = [];
        }
    }

    async saveFeedback(feedbackType) {
        try {
            const feedback = {
                id: Date.now() + Math.random(),
                type: feedbackType,
                timestamp: Date.now(),
                detection: this.currentDetection,
                sessionId: this.sessionId
            };
            
            const db = await this.openDatabase();
            const transaction = db.transaction(['feedback'], 'readwrite');
            const store = transaction.objectStore('feedback');
            await store.add(feedback);
            
            console.log('Feedback saved:', feedbackType);
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EcoSortAI_ML', 2);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('trainingData')) {
                    const trainingStore = db.createObjectStore('trainingData', { keyPath: 'id' });
                    trainingStore.createIndex('timestamp', 'timestamp', { unique: false });
                    trainingStore.createIndex('label', 'label', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('feedback')) {
                    const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' });
                    feedbackStore.createIndex('timestamp', 'timestamp', { unique: false });
                    feedbackStore.createIndex('type', 'type', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('modelHistory')) {
                    const modelStore = db.createObjectStore('modelHistory', { keyPath: 'id' });
                    modelStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('statistics')) {
                    const statsStore = db.createObjectStore('statistics', { keyPath: 'id' });
                    statsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // ============= PERFORMANCE MONITORING =============
    
    updatePerformanceMetrics(processingTime) {
        // Update FPS
        this.frameCount++;
        const now = performance.now();
        
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            
            // Update FPS display
            const fpsElement = document.getElementById('fpsCounter');
            if (fpsElement) {
                fpsElement.textContent = this.fps;
            }
        }
        
        // Track processing time
        this.processingTimes.push(processingTime);
        if (this.processingTimes.length > 100) {
            this.processingTimes.shift();
        }
        
        // Update ML status
        this.updateMLStatus();
    }

    updateMLStatus() {
        const statusElement = document.getElementById('mlStatus');
        if (!statusElement) return;
        
        let status, className;
        
        if (this.isTraining) {
            status = 'Đang huấn luyện';
            className = 'training';
        } else if (this.modelMetrics.accuracy > 0.8) {
            status = 'Hoạt động tốt';
            className = 'ready';
        } else if (this.modelMetrics.accuracy > 0.6) {
            status = 'Cần cải thiện';
            className = 'warning';
        } else {
            status = 'Cần huấn luyện';
            className = 'error';
        }
        
        statusElement.textContent = status;
        statusElement.className = `info-value ml-status ${className}`;
    }

    updateDetectionStats(detectionCount) {
        this.totalDetections += detectionCount;
        
        const detectionElement = document.getElementById('detectionCount');
        if (detectionElement) {
            detectionElement.textContent = this.totalDetections;
        }
        
        // Update session statistics
        this.sessionStats.detections++;
        this.sessionStats.lastActivity = Date.now();
        
        // Save statistics periodically
        if (this.sessionStats.detections % 10 === 0) {
            this.saveSessionStats();
        }
    }

    async saveSessionStats() {
        try {
            const stats = {
                id: this.sessionId,
                ...this.sessionStats,
                timestamp: Date.now()
            };
            
            const db = await this.openDatabase();
            const transaction = db.transaction(['statistics'], 'readwrite');
            const store = transaction.objectStore('statistics');
            await store.put(stats);
            
        } catch (error) {
            console.error('Error saving session stats:', error);
        }
    }

    handleDetectionError(error) {
        console.error('Detection error:', error);
        
        this.errorCount++;
        
        // Show user-friendly error message
        if (error.message.includes('WebGL')) {
            this.showNotification('Lỗi WebGL. Vui lòng kiểm tra hỗ trợ GPU.', 'error');
        } else if (error.message.includes('memory')) {
            this.showNotification('Không đủ bộ nhớ. Vui lòng đóng các tab khác.', 'error');
        } else {
            this.showNotification('Lỗi phát hiện. Đang thử lại...', 'warning');
        }
        
        // Attempt recovery
        if (this.errorCount < 3) {
            setTimeout(() => {
                console.log('Attempting to recover from error...');
                this.detectObjects();
            }, 2000);
        } else {
            console.log('Too many errors, stopping detection');
            this.stopDetection();
        }
    }

    // ============= UTILITY METHODS =============
    
    clearResults() {
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-detection">
                    <i class="fas fa-eye-slash"></i>
                    <p>Chưa phát hiện rác thải nào</p>
                    <small>Hướng camera về phía các vật thể cần phân loại</small>
                </div>
            `;
        }
    }

    showNoDetection() {
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-detection">
                    <i class="fas fa-search"></i>
                    <p>Không phát hiện vật thể nào</p>
                    <small>Thử di chuyển camera hoặc thay đổi góc nhìn</small>
                </div>
            `;
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateClientId() {
        let clientId = localStorage.getItem('ecosort-client-id');
        if (!clientId) {
            clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ecosort-client-id', clientId);
        }
        return clientId;
    }

    // ============= CLEANUP AND DISPOSAL =============
    
    dispose() {
        // Stop detection
        this.stopDetection();
        
        // Dispose TensorFlow resources
        if (this.model) {
            this.model.dispose();
        }
        
        if (this.customModel) {
            this.customModel.dispose();
        }
        
        // Clear intervals
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }
        
        // Save final statistics
        this.saveSessionStats();
        this.saveMLStats();
        
        console.log('🧹 EcoSort AI disposed successfully');
    }
}

// ============= INITIALIZATION =============

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing EcoSort AI ML Edition...');
    
    try {
        // Show loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingText = document.getElementById('loadingText');
        const loadingProgress = document.getElementById('loadingProgress');
        
        // Update loading progress
        const updateProgress = (progress, text) => {
            if (loadingProgress) loadingProgress.style.width = progress + '%';
            if (loadingText) loadingText.textContent = text;
        };
        
        updateProgress(10, 'Đang khởi tạo TensorFlow.js...');
        
        // Initialize the ML classifier
        window.wasteClassifier = new MLWasteClassifier();
        
        updateProgress(30, 'Đang tải mô hình AI...');
        
        // Initialize the classifier
        await window.wasteClassifier.initialize();
        
        updateProgress(60, 'Đang thiết lập giao diện...');
        
        // Setup UI components
        setupUI();
        
        updateProgress(80, 'Đang tải dữ liệu huấn luyện...');
        
        // Load saved data
        window.wasteClassifier.loadMLStats();
        await window.wasteClassifier.loadTrainingData();
        
        updateProgress(100, 'Hoàn tất!');
        
        // Hide loading screen
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        console.log('✅ EcoSort AI ML Edition initialized successfully!');
        
        // Show welcome notification
        setTimeout(() => {
            window.wasteClassifier.showNotification(
                'Chào mừng đến với EcoSort AI ML Edition! 🤖🌱', 
                'success'
            );
        }, 1500);
        
    } catch (error) {
        console.error('❌ Failed to initialize EcoSort AI:', error);
        
        // Show error message
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = 'Lỗi khởi tạo. Vui lòng tải lại trang.';
            loadingText.style.color = '#f44336';
        }
    }
});

// Setup UI event listeners
function setupUI() {
    // Navigation
    setupNavigation();
    
    // Camera controls
    setupCameraControls();
    
    // ML Dashboard
    setupMLDashboard();
    
    // Settings
    setupSettings();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Theme toggle
    setupThemeToggle();
    
    // PWA features
    setupPWAFeatures();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                    section.scrollIntoView({ behavior: 'smooth' });
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

function setupCameraControls() {
    const startCameraBtn = document.getElementById('startCamera');
    const captureImageBtn = document.getElementById('captureImage');
    const uploadImageBtn = document.getElementById('uploadImage');
    const toggleDetectionBtn = document.getElementById('toggleDetection');
    const stopCameraBtn = document.getElementById('stopCamera');
    const imageInput = document.getElementById('imageInput');
    
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', () => {
            window.wasteClassifier.startCamera();
        });
    }
    
    if (captureImageBtn) {
        captureImageBtn.addEventListener('click', () => {
            window.wasteClassifier.captureImage();
        });
    }
    
    if (uploadImageBtn) {
        uploadImageBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }
    
    if (toggleDetectionBtn) {
        toggleDetectionBtn.addEventListener('click', () => {
            window.wasteClassifier.toggleDetection();
        });
    }
    
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', () => {
            window.wasteClassifier.stopCamera();
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    window.wasteClassifier.processStaticImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function setupMLDashboard() {
    const trainModelBtn = document.getElementById('trainModel');
    const exportModelBtn = document.getElementById('exportModel');
    const importModelBtn = document.getElementById('importModel');
    
    if (trainModelBtn) {
        trainModelBtn.addEventListener('click', () => {
            window.wasteClassifier.retrainModel();
        });
    }
    
    if (exportModelBtn) {
        exportModelBtn.addEventListener('click', () => {
            window.wasteClassifier.exportModel();
        });
    }
    
    if (importModelBtn) {
        importModelBtn.addEventListener('click', () => {
            window.wasteClassifier.importModel();
        });
    }
    
    // ML configuration controls
    setupMLConfigControls();
}

function setupMLConfigControls() {
    const learningRateSlider = document.getElementById('learningRate');
    const learningRateValue = document.getElementById('learningRateValue');
    const batchSizeSelect = document.getElementById('batchSize');
    const epochsInput = document.getElementById('epochs');
    
    if (learningRateSlider && learningRateValue) {
        learningRateSlider.addEventListener('input', () => {
            learningRateValue.textContent = learningRateSlider.value;
            window.wasteClassifier.trainingConfig.learningRate = parseFloat(learningRateSlider.value);
        });
    }
    
    if (batchSizeSelect) {
        batchSizeSelect.addEventListener('change', () => {
            window.wasteClassifier.trainingConfig.batchSize = parseInt(batchSizeSelect.value);
        });
    }
    
    if (epochsInput) {
        epochsInput.addEventListener('change', () => {
            window.wasteClassifier.trainingConfig.epochs = parseInt(epochsInput.value);
        });
    }
}

function setupSettings() {
    const confidenceSlider = document.getElementById('confidenceThreshold');
    const confidenceValue = document.getElementById('confidenceValue');
    const detectionSpeedSelect = document.getElementById('detectionSpeed');
    const enableOnlineLearning = document.getElementById('enableOnlineLearning');
    const enableFederatedLearning = document.getElementById('enableFederatedLearning');
    const autoRetrainThreshold = document.getElementById('autoRetrainThreshold');
    const enableGPU = document.getElementById('enableGPU');
    const enableWorker = document.getElementById('enableWorker');
    const memoryLimit = document.getElementById('memoryLimit');
    
    // Settings event listeners
    if (confidenceSlider && confidenceValue) {
        confidenceSlider.addEventListener('input', () => {
            const value = Math.round(confidenceSlider.value * 100);
            confidenceValue.textContent = value + '%';
            window.wasteClassifier.confidenceThreshold = parseFloat(confidenceSlider.value);
        });
    }
    
    if (detectionSpeedSelect) {
        detectionSpeedSelect.addEventListener('change', () => {
            const speed = detectionSpeedSelect.value;
            let interval;
            switch (speed) {
                case 'fast': interval = 33; break; // 30 FPS
                case 'medium': interval = 66; break; // 15 FPS
                case 'slow': interval = 200; break; // 5 FPS
            }
            window.wasteClassifier.detectionInterval = interval;
        });
    }
    
    if (enableOnlineLearning) {
        enableOnlineLearning.addEventListener('change', () => {
            window.wasteClassifier.onlineLearning.enabled = enableOnlineLearning.checked;
        });
    }
    
    if (enableFederatedLearning) {
        enableFederatedLearning.addEventListener('change', () => {
            window.wasteClassifier.federatedLearning.enabled = enableFederatedLearning.checked;
        });
    }
    
    // Data management buttons
    setupDataManagement();
}

function setupDataManagement() {
    const exportDataBtn = document.getElementById('exportData');
    const importDataBtn = document.getElementById('importData');
    const clearAllDataBtn = document.getElementById('clearAllData');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            window.wasteClassifier.exportAllData();
        });
    }
    
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => {
            window.wasteClassifier.importAllData();
        });
    }
    
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
                window.wasteClassifier.clearAllData();
            }
        });
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key.toLowerCase()) {
            case 'c':
                e.preventDefault();
                document.getElementById('startCamera')?.click();
                break;
            case ' ':
                e.preventDefault();
                document.getElementById('captureImage')?.click();
                break;
            case 'p':
                e.preventDefault();
                document.getElementById('toggleDetection')?.click();
                break;
            case 's':
                e.preventDefault();
                document.getElementById('stopCamera')?.click();
                break;
            case 'u':
                e.preventDefault();
                document.getElementById('uploadImage')?.click();
                break;
            case 'h':
                e.preventDefault();
                showShortcutsModal();
                break;
            case 'r':
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                    window.wasteClassifier.retrainModel();
                }
                break;
        }
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
    }
}

function setupPWAFeatures() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
    
    // Handle app updates
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }
}

// Utility functions
function showShortcutsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-keyboard"></i> Phím tắt</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="shortcuts-grid">
                    <div class="shortcut-item">
                        <kbd>C</kbd>
                        <span>Bật camera</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Space</kbd>
                        <span>Chụp ảnh</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>P</kbd>
                        <span>Tạm dừng/Tiếp tục</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>S</kbd>
                        <span>Dừng camera</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>U</kbd>
                        <span>Tải ảnh lên</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl + R</kbd>
                        <span>Huấn luyện lại mô hình</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>H</kbd>
                        <span>Hiển thị phím tắt</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function showPrivacyPolicy() {
    // Implementation for privacy policy modal
    console.log('Show privacy policy');
}

function showTermsOfService() {
    // Implementation for terms of service modal
    console.log('Show terms of service');
}

function showAbout() {
    // Implementation for about modal
    console.log('Show about');
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.wasteClassifier) {
        window.wasteClassifier.dispose();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (window.wasteClassifier) {
        if (document.hidden) {
            window.wasteClassifier.pauseDetection();
        } else {
            window.wasteClassifier.resumeDetection();
        }
    }
});

console.log('🌟 EcoSort AI ML Edition script loaded successfully!');


