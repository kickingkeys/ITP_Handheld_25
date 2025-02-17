class DrawingApp {
    constructor() {
        this.setupCanvases();
        this.setupTools();
        this.setupEventListeners();
        this.checkOrientation();
        this.isDrawing = false;
        this.lastPoint = null;
        this.lastTimestamp = 0;
        this.lastClickTime = 0;
        this.minPressure = 0.3;
        this.maxPressure = 1.5;
        
        // Debug log for initialization
        console.log('DrawingApp initialized');
    }

    setupCanvases() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.effectCanvas = document.getElementById('effectCanvas');
        
        if (!this.mainCanvas || !this.effectCanvas) {
            console.error('Canvas elements not found!');
            return;
        }
        
        this.ctx = this.mainCanvas.getContext('2d');
        this.effectCtx = this.effectCanvas.getContext('2d');
        this.resize();
    }

    setupTools() {
        this.currentTool = 'watercolor';
        this.tools = {
            watercolor: new WatercolorBrush(this.ctx),
            stamp: new StampTool(this.ctx),
            tinsel: new TinselBrush(this.ctx)
        };
        console.log('Tools initialized:', Object.keys(this.tools));
    }

    resize() {
        const pixelRatio = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Set canvas sizes
        this.mainCanvas.width = width * pixelRatio;
        this.mainCanvas.height = height * pixelRatio;
        this.effectCanvas.width = width * pixelRatio;
        this.effectCanvas.height = height * pixelRatio;
        
        // Set display sizes
        this.mainCanvas.style.width = `${width}px`;
        this.mainCanvas.style.height = `${height}px`;
        this.effectCanvas.style.width = `${width}px`;
        this.effectCanvas.style.height = `${height}px`;
        
        // Scale contexts
        this.ctx.scale(pixelRatio, pixelRatio);
        this.effectCtx.scale(pixelRatio, pixelRatio);
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('resize', () => {
            this.resize();
            this.checkOrientation();
        });
        window.addEventListener('orientationchange', () => this.checkOrientation());

        // Canvas events
        if (this.mainCanvas) {
            this.mainCanvas.addEventListener('pointerdown', e => {
                e.preventDefault(); // Prevent default to ensure proper touch handling
                const currentTime = performance.now();
                if (this.currentTool === 'stamp' && 
                    currentTime - this.lastClickTime < 300) {
                    this.tools.stamp.cycleShape();
                }
                this.lastClickTime = currentTime;
                this.startDrawing(e);
            });

            this.mainCanvas.addEventListener('pointermove', e => {
                e.preventDefault();
                this.draw(e);
            });

            this.mainCanvas.addEventListener('pointerup', e => {
                e.preventDefault();
                this.stopDrawing();
            });

            this.mainCanvas.addEventListener('pointerout', e => {
                e.preventDefault();
                this.stopDrawing();
            });
        }

        // Tool selection
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tool = btn.getAttribute('data-tool');
                console.log('Button clicked:', tool); // Debug log
                
                if (tool && this.tools[tool]) {
                    this.currentTool = tool;
                    toolButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    console.log('Current tool set to:', this.currentTool); // Debug log
                } else if (btn.id === 'explodeBtn') {
                    this.explode();
                }
            });
        });

        // Set initial active tool
        const initialTool = document.querySelector('[data-tool="watercolor"]');
        if (initialTool) {
            initialTool.classList.add('active');
        }
    }

    checkOrientation() {
        const warning = document.getElementById('orientationWarning');
        const isLandscape = window.innerWidth > window.innerHeight;
        warning.classList.toggle('hidden', isLandscape);
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.lastPoint = this.getPointerPosition(e);
        this.lastTimestamp = performance.now();
    }

    draw(e) {
        if (!this.isDrawing || !this.tools[this.currentTool]) {
            return;
        }

        const currentPoint = this.getPointerPosition(e);
        if (!currentPoint) return;

        const currentTime = performance.now();
        const timeDelta = (currentTime - this.lastTimestamp) / 1000;

        // Calculate drawing dynamics with limits
        const speed = Math.min(
            utils.calculateSpeed(currentPoint, this.lastPoint, timeDelta),
            100
        );
        const angle = utils.calculateAngle(currentPoint, this.lastPoint);
        
        // More dramatic pressure range
        const rawPressure = e.pressure || 0.5;
        const normalizedPressure = this.minPressure + 
            (rawPressure * (this.maxPressure - this.minPressure));

        try {
            this.tools[this.currentTool].draw(
                currentPoint.x,
                currentPoint.y,
                speed,
                angle,
                normalizedPressure
            );
        } catch (error) {
            console.error('Drawing error:', error);
        }

        this.lastPoint = currentPoint;
        this.lastTimestamp = currentTime;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    getPointerPosition(e) {
        if (!this.mainCanvas) return null;
        
        const rect = this.mainCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    explode() {
        // Capture current canvas state
        const imageData = this.ctx.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        const particles = [];
        const particleSize = 4;
        
        // Create particles from canvas content
        for (let y = 0; y < this.mainCanvas.height; y += particleSize * 2) {
            for (let x = 0; x < this.mainCanvas.width; x += particleSize * 2) {
                const i = (y * this.mainCanvas.width + x) * 4;
                if (imageData.data[i + 3] < 128) continue;

                const color = `rgb(${imageData.data[i]}, ${imageData.data[i + 1]}, ${imageData.data[i + 2]})`;
                const angle = Math.random() * Math.PI * 2;
                const velocity = 5 + Math.random() * 5;
                
                particles.push({
                    x,
                    y,
                    color,
                    size: particleSize,
                    speedX: Math.cos(angle) * velocity,
                    speedY: Math.sin(angle) * velocity,
                    life: 1.0
                });
            }
        }

        // Clear both canvases
        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.effectCtx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);

        // Animate particles
        const animate = () => {
            this.effectCtx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);
            
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += 0.2; // gravity
                particle.life -= 0.02;
                
                if (particle.life > 0) {
                    this.effectCtx.save();
                    this.effectCtx.globalAlpha = particle.life;
                    this.effectCtx.fillStyle = particle.color;
                    this.effectCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
                    this.effectCtx.restore();
                } else {
                    particles.splice(i, 1);
                }
            }
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize the application
const app = new DrawingApp(); 