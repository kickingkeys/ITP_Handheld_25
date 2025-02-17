class WatercolorBrush {
    constructor(ctx) {
        this.ctx = ctx;
        this.baseSize = 30;
        this.minSize = 20;
        this.maxSize = 60;
        this.color = '#3498db';
        this.noiseCanvas = utils.createNoise(256, 256);
        this.setupMask();
        this.lastPoints = [];
        this.maxPoints = 3;
    }

    setupMask() {
        // Create mask pattern for organic edges
        this.maskCanvas = document.createElement('canvas');
        this.maskCanvas.width = 256;
        this.maskCanvas.height = 256;
        const maskCtx = this.maskCanvas.getContext('2d');
        
        // Create soft-edged circle mask
        const gradient = maskCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'transparent');
        
        maskCtx.fillStyle = gradient;
        maskCtx.fillRect(0, 0, 256, 256);
        
        // Add noise to mask
        maskCtx.globalCompositeOperation = 'overlay';
        maskCtx.drawImage(this.noiseCanvas, 0, 0);
    }

    draw(x, y, speed, angle, pressure = 0.5) {
        // Store points for smooth line
        this.lastPoints.push({ x, y });
        if (this.lastPoints.length > this.maxPoints) {
            this.lastPoints.shift();
        }

        // Calculate size with more dramatic pressure influence
        const pressureInfluence = pressure * 2; // Make pressure more impactful
        const speedInfluence = Math.min(speed * 0.1, 5);
        const size = Math.min(Math.max(
            this.baseSize * pressureInfluence + speedInfluence,
            this.minSize
        ), this.maxSize);

        this.ctx.save();
        
        // Set blending for watercolor effect
        this.ctx.globalCompositeOperation = 'multiply';
        
        // Draw multiple overlapping circles for each point
        for (const point of this.lastPoints) {
            // Draw multiple layers with different opacities
            for (let i = 0; i < 3; i++) {
                const layerSize = size * (1 - i * 0.2);
                const opacity = 0.2 - (i * 0.05); // More opacity variation
                
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = this.color;
                
                // Add slight randomness to position for organic feel
                const offsetX = (Math.random() - 0.5) * 2;
                const offsetY = (Math.random() - 0.5) * 2;
                
                this.ctx.beginPath();
                this.ctx.arc(
                    point.x + offsetX,
                    point.y + offsetY,
                    layerSize,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
} 