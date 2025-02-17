class ExplosionEffect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.particleSize = 4;
        this.animationId = null;
    }

    trigger() {
        // Capture current canvas state
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.generateParticles(imageData);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Start animation
        this.animate();
        
        // Clear particles after animation
        setTimeout(() => {
            this.particles = [];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            cancelAnimationFrame(this.animationId);
        }, 1000);
    }

    generateParticles(imageData) {
        const particles = [];
        const data = imageData.data;
        
        for (let y = 0; y < this.canvas.height; y += this.particleSize * 2) {
            for (let x = 0; x < this.canvas.width; x += this.particleSize * 2) {
                const i = (y * this.canvas.width + x) * 4;
                
                // Skip transparent pixels
                if (data[i + 3] < 128) continue;

                const color = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
                const angle = Math.random() * Math.PI * 2;
                const velocity = 5 + Math.random() * 5;
                
                particles.push({
                    x,
                    y,
                    color,
                    size: this.particleSize,
                    speedX: Math.cos(angle) * velocity,
                    speedY: Math.sin(angle) * velocity,
                    life: 1.0
                });
            }
        }
        
        return particles;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.1; // gravity
            particle.life -= 0.02;
            
            // Draw particle
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                this.ctx.restore();
            } else {
                this.particles.splice(i, 1);
            }
        }
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
} 