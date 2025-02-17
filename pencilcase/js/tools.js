// Utility functions
const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const getAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1);
};

// Tool implementations
const tools = {
    watercolor: {
        baseSize: 15,
        speedMultiplier: 0.5,
        maxOpacity: 0.8,
        opacityReduction: 0.3,
        color: '#3498db',

        draw(ctx, x, y, speed, angle, pressure = 1.0) {
            const size = this.baseSize + (speed * this.speedMultiplier);
            const opacity = Math.max(0.1, this.maxOpacity - (speed * this.opacityReduction));
            
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = this.color;
            
            // Create multiple overlapping circles for watercolor effect
            for (let i = 0; i < 3; i++) {
                const offsetX = Math.cos(angle + (i * Math.PI / 4)) * size * 0.3;
                const offsetY = Math.sin(angle + (i * Math.PI / 4)) * size * 0.3;
                
                ctx.beginPath();
                ctx.arc(x + offsetX, y + offsetY, size * (1 - i * 0.2) * pressure, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    },

    wacky: {
        baseSize: 15,
        colors: ['#8e44ad', '#d35400', '#2ecc71', '#e74c3c'],
        
        draw(ctx, x, y, speed, angle) {
            const size = this.baseSize * (1 + speed * 0.2);
            const rotation = angle * (180 / Math.PI);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            // Generate random shapes based on speed
            const shapes = Math.floor(speed * 3) + 1;
            
            for (let i = 0; i < shapes; i++) {
                ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
                
                if (i % 3 === 0) {
                    // Draw star
                    this.drawStar(ctx, 0, 0, size);
                } else if (i % 3 === 1) {
                    // Draw square
                    ctx.fillRect(-size/2, -size/2, size, size);
                } else {
                    // Draw circle
                    ctx.beginPath();
                    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.rotate(Math.PI / shapes);
            }
            
            ctx.restore();
        },

        drawStar(ctx, x, y, size) {
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const point = {
                    x: Math.cos(angle) * size/2,
                    y: Math.sin(angle) * size/2
                };
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.closePath();
            ctx.fill();
        }
    },

    stamp: {
        baseSize: 20,
        shapes: ['circle', 'star', 'spiral'],
        colors: ['#2ecc71', '#e74c3c', '#f1c40f'],
        
        draw(ctx, x, y, speed, angle) {
            const size = this.baseSize + (speed * 10);
            const rotation = angle;
            const shapeIndex = Math.floor(speed * 2) % this.shapes.length;
            const shape = this.shapes[shapeIndex];
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            switch(shape) {
                case 'circle':
                    this.drawCircle(ctx, size);
                    break;
                case 'star':
                    this.drawStar(ctx, size);
                    break;
                case 'spiral':
                    this.drawSpiral(ctx, size);
                    break;
            }
            
            ctx.restore();
        },

        drawCircle(ctx, size) {
            ctx.beginPath();
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
            ctx.fill();
        },

        drawStar(ctx, size) {
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const point = {
                    x: Math.cos(angle) * size/2,
                    y: Math.sin(angle) * size/2
                };
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.closePath();
            ctx.fill();
        },

        drawSpiral(ctx, size) {
            ctx.beginPath();
            for (let i = 0; i < 20; i++) {
                const angle = (i * Math.PI * 2) / 20;
                const radius = (size/2) * (i / 20);
                const point = {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                };
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
            ctx.fill();
        }
    }
}; 