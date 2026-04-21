/* =========================================
   CertiChain – script.js
   ========================================= */

'use strict';

/* ─── PARTICLE CANVAS ─── */
(function () {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const COLORS = ['rgba(26,127,255,', 'rgba(96,184,255,', 'rgba(176,196,222,'];
    const PARTICLE_COUNT = 80;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 2 + 0.5;
            this.dx = (Math.random() - 0.5) * 0.4;
            this.dy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.x += this.dx; this.y += this.dy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(26,127,255,${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
})();

/* ─── NAVBAR SCROLL ─── */
(function () {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });
})();

/* ─── HAMBURGER MENU ─── */
(function () {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    btn.addEventListener('click', () => {
        links.classList.toggle('active');
        btn.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('active');
            btn.classList.remove('open');
        });
    });
})();

/* ─── SCROLL REVEAL ─── */
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (entry.target.dataset.delay || 0));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Stagger children
    document.querySelectorAll('.features-grid, .team-grid, .steps-container, .stats-container').forEach(grid => {
        grid.querySelectorAll('.reveal').forEach((el, i) => {
            el.dataset.delay = i * 100;
        });
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
})();

/* ─── COUNTER ANIMATION ─── */
(function () {
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString('tr-TR');
        }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => observer.observe(el));
})();

/* ─── SMOOTH ACTIVE NAV LINK ─── */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === '#' + current) {
                a.style.color = 'var(--blue-light)';
            }
        });
    }, { passive: true });
})();

/* ─── CONTACT FORM ─── */
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Gönderildi!';
        btn.style.background = 'linear-gradient(135deg, #00c851, #007e33)';
        btn.style.boxShadow = '0 0 24px rgba(0,200,81,0.4)';
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.boxShadow = '';
            form.reset();
        }, 3000);
    });
})();

/* ─── TILT EFFECT ON CARDS ─── */
(function () {
    document.querySelectorAll('.feature-card, .team-card, .step-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = (-y / (rect.height / 2)) * 5;
            const rotY = (x / (rect.width / 2)) * 5;
            card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
