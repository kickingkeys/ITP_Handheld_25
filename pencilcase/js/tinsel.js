class TinselBrush {
    constructor(ctx) {
        this.ctx = ctx;
        this.baseSize = 15;
        this.minSize = 10;
        this.maxSize = 35;
        this.colorOffset = 0;
        this.particles = [];
        this.lastUpdate = performance.now();
        this.startAnimation();
    }

    startAnimation() {
        const animate = () => {
            const now = performance.now();
            const delta = (now - this.lastUpdate) / 1000;
            this.updateParticles(delta);
            this.lastUpdate = now;
            requestAnimationFrame(animate);
        };
        animate();
    }

    draw(x, y, speed, angle, pressure = 0.5) {
        // Calculate size with limits
        const speedInfluence = Math.min(speed * 0.2, 10);
        const size = Math.min(Math.max(
            this.baseSize * pressure + speedInfluence,
            this.minSize
        ), this.maxSize);
        
        this.colorOffset += 0.1;
        
        // Set blending for bright overlaps
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // Draw main rainbow stroke
        const gradient = this.ctx.createLinearGradient(
            x - size, y - size,
            x + size, y + size
        );
        
        // Add rainbow colors
        gradient.addColorStop(0, utils.getRainbowColor(this.colorOffset));
        gradient.addColorStop(0.5, utils.getRainbowColor(this.colorOffset + 2));
        gradient.addColorStop(1, utils.getRainbowColor(this.colorOffset + 4));
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Add sparkle particles with limited count
        this.addSparkles(x, y, Math.min(speed, 20), angle);
    }

    addSparkles(x, y, speed, angle) {
        const particleCount = Math.min(Math.floor(speed * 2) + 2, 8); // Limit particle count
        
        for(let i = 0; i < particleCount; i++) {
            const particleAngle = angle + utils.getRandomFloat(-Math.PI/3, Math.PI/3);
            const velocity = Math.min(speed * utils.getRandomFloat(0.5, 1.5), 10);
            
            this.particles.push({
                x,
                y,
                size: utils.getRandomFloat(2, 4),
                color: utils.getRainbowColor(this.colorOffset + utils.getRandomFloat(0, 6)),
                speedX: Math.cos(particleAngle) * velocity,
                speedY: Math.sin(particleAngle) * velocity,
                life: 1.0,
                type: Math.random() > 0.5 ? 'star' : 'circle'
            });
        }

        // Limit total particles
        if (this.particles.length > 100) {
            this.particles = this.particles.slice(-100);
        }
    }

    updateParticles(delta) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for(let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= delta * 2;
            
            // Draw particle
            if(particle.life > 0) {
                this.ctx.save();
                this.ctx.translate(particle.x, particle.y);
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                
                if(particle.type === 'star') {
                    this.drawSparkle(particle.size);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                this.ctx.restore();
            } else {
                this.particles.splice(i, 1);
            }
        }
        
        this.ctx.restore();
    }

    drawSparkle(size) {
        this.ctx.beginPath();
        
        // Draw cross shape
        this.ctx.moveTo(-size, 0);
        this.ctx.lineTo(size, 0);
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(0, size);
        
        // Draw diagonal lines
        const diagonalSize = size * 0.7;
        this.ctx.moveTo(-diagonalSize, -diagonalSize);
        this.ctx.lineTo(diagonalSize, diagonalSize);
        this.ctx.moveTo(-diagonalSize, diagonalSize);
        this.ctx.lineTo(diagonalSize, -diagonalSize);
        
        this.ctx.lineWidth = size * 0.2;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.stroke();
    }
} 