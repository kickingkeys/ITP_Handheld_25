class StampTool {
    constructor(mainCtx) {
        this.mainCtx = mainCtx;
        this.baseSize = 40;
        this.minSize = 30;
        this.maxSize = 80;
        this.emojis = [
            '⭐️', '🌟', '✨', '💫', '⚡️', '❤️', '🧡', '💛', '💚', '💙',
            '💜', '🤍', '🌈', '☀️', '🌙', '⭐️', '🌟', '✨', '💫', '⚡️'
        ];
        this.currentEmoji = this.getRandomEmoji();
        this.rotationAngle = 0;
        this.lastX = null;
        this.lastY = null;
    }

    getRandomEmoji() {
        return this.emojis[Math.floor(Math.random() * this.emojis.length)];
    }

    draw(x, y, speed, angle, pressure = 0.5) {
        // Make pressure more dramatic (0.3 to 1.5 range)
        const adjustedPressure = 0.3 + (pressure * 1.2);
        const size = Math.min(Math.max(
            this.baseSize * adjustedPressure,
            this.minSize
        ), this.maxSize);

        // Calculate rotation based on movement
        if (this.lastX !== null && this.lastY !== null) {
            const dx = x - this.lastX;
            const dy = y - this.lastY;
            if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
                this.rotationAngle += 0.1;
            }
        }

        // Draw emoji
        this.mainCtx.save();
        this.mainCtx.translate(x, y);
        this.mainCtx.rotate(this.rotationAngle);
        this.mainCtx.font = `${size}px Arial`;
        this.mainCtx.textAlign = 'center';
        this.mainCtx.textBaseline = 'middle';
        this.mainCtx.fillText(this.currentEmoji, 0, 0);
        this.mainCtx.restore();

        // Get new random emoji for next stamp
        this.currentEmoji = this.getRandomEmoji();
        
        this.lastX = x;
        this.lastY = y;
    }

    cycleShape() {
        this.currentEmoji = this.getRandomEmoji();
    }
} 