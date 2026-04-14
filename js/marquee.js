class MarqueeEngine {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.track = this.container.children[0];
        if (!this.track) return;

        this.options = Object.assign({
            speed: 1.0,
            direction: 'left', // 'left' or 'right'
            type: 'image'      // 'image', 'video', 'certificate'
        }, options);

        this.items = Array.from(this.track.children);
        if (this.items.length === 0) return;

        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.velocity = 0;
        this.animationId = null;
        this.lastTime = 0;
        this.originalWidth = 0;
        this.isPlaying = false;
        this.isVisible = false;

        this.init();
    }

    init() {
        this.cloneItems();
        this.calculateWidth();

        // Bind methods
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.animate = this.animate.bind(this);

        // Events for Drag
        this.container.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
        window.addEventListener('pointercancel', this.onPointerUp);

        // Interactive logic (pause and scale on click)
        this.initInteractiveLogic();

        // Resize observer
        window.addEventListener('resize', () => {
            this.calculateWidth();
        });

        // Intersection Observer for battery saving
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible && !this.isPlaying && !this.isReducedMotion) {
                    this.startAnimation();
                } else if (!this.isVisible) {
                    this.stopAnimation();
                }
            });
        }, { rootMargin: '50px' });

        observer.observe(this.container);
    }

    cloneItems() {
        // Clone items so we can loop seamlessly
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            this.track.appendChild(clone);
        });
    }

    calculateWidth() {
        // Calculate the width of the original set of items + gaps
        let totalWidth = 0;
        const gap = parseFloat(window.getComputedStyle(this.track).gap) || 0;
        this.items.forEach((item, index) => {
            totalWidth += item.offsetWidth;
            if (index < this.items.length - 1) totalWidth += gap;
        });
        // Add gap after last item to connect with the clone smoothly
        if (this.items.length > 0) {
            totalWidth += gap;
        }
        this.originalWidth = totalWidth;
    }

    initInteractiveLogic() {
        // Pause auto-scroll on click and scale/play
        const allCards = Array.from(this.track.children);

        allCards.forEach(card => {
            // For videos, clicking overlay is better. For images, click the card itself.
            const clickTarget = card.querySelector('.video-overlay') || card;

            clickTarget.addEventListener('click', (e) => {
                if (Math.abs(this.velocity) > 2) return; // Prevent click if dragging

                // If clicking an active card, maybe ignore or close it (here we keep it active)
                if (card.classList.contains('active-card')) return;

                this.resetActiveCards();
                card.classList.add('active-card');
                this.stopAnimation();

                // Post message to vimeo to play if it's a video
                const iframe = card.querySelector('iframe');
                if (iframe) {
                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                }
            });
        });

        // If clicking outside the active card, resume
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.resetActiveCards();
                if (this.isVisible && !this.isReducedMotion && !this.isPlaying) {
                    this.startAnimation();
                }
            }
        });
    }

    resetActiveCards() {
        const activeCards = this.container.querySelectorAll('.active-card');
        activeCards.forEach(card => {
            card.classList.remove('active-card');
            const iframe = card.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage('{"method":"pause"}', '*');
            }
        });
    }

    onPointerDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.prevTranslate = this.currentTranslate;
        this.velocity = 0;

        this.resetActiveCards();
    }

    onPointerMove(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.startX;
        this.currentTranslate = this.prevTranslate + deltaX;

        // Calculate velocity
        this.velocity = deltaX;
        this.startX = e.clientX;
        this.prevTranslate = this.currentTranslate;
    }

    onPointerUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
    }

    startAnimation() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastTime = performance.now();
        this.animationId = requestAnimationFrame(this.animate);
    }

    stopAnimation() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate(time) {
        if (!this.isPlaying) return;

        const dt = time - this.lastTime;
        this.lastTime = time;

        if (!this.isDragging && !this.container.querySelector('.active-card')) {
            if (Math.abs(this.velocity) > 0.1) {
                // Momentum deceleration
                this.currentTranslate += this.velocity;
                this.velocity *= 0.95; // friction
            } else if (!this.isReducedMotion) {
                // Auto scroll
                let speed = this.options.speed * (dt / 16.66); // Normalize speed across refresh rates
                if (this.options.direction === 'left') {
                    this.currentTranslate -= speed;
                } else {
                    this.currentTranslate += speed;
                }
            }
        }

        // Seamless looping using CSS transform
        let maxTranslate = this.originalWidth;

        if (this.currentTranslate <= -maxTranslate) {
            this.currentTranslate += maxTranslate;
        } else if (this.currentTranslate > 0) {
            this.currentTranslate -= maxTranslate;
        }

        this.track.style.transform = `translate3d(${this.currentTranslate}px, 0, 0)`;

        // Keep animating
        this.animationId = requestAnimationFrame(this.animate);
    }
}

window.MarqueeEngine = MarqueeEngine;
