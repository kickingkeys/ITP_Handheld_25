const utils = {
    calculateSpeed(current, last, time) {
        const dx = current.x - last.x;
        const dy = current.y - last.y;
        return Math.sqrt(dx*dx + dy*dy) / time;
    },

    calculateAngle(current, last) {
        return Math.atan2(current.y - last.y, current.x - last.x);
    },

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    createNoise(width, height, scale = 20) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    },

    blendColors(color1, color2, ratio) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },

    getRainbowColor(offset) {
        const frequency = 0.1;
        const r = Math.sin(frequency * offset + 0) * 127 + 128;
        const g = Math.sin(frequency * offset + 2) * 127 + 128;
        const b = Math.sin(frequency * offset + 4) * 127 + 128;
        
        return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
    },

    createGradient(ctx, x, y, radius, color1, color2) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }
}; 