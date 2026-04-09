document.addEventListener("DOMContentLoaded", () => {
    // Mobile Nav Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Reveal animations on scroll using Intersection Observer
    const revealElements = document.querySelectorAll('.service-card, .about-content, .about-image, .section-title, .contact-form');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach((el, index) => {
        el.classList.add('hidden-reveal');
        // Add a slight stagger to elements that might appear at the same time
        if (el.classList.contains('service-card')) {
            el.style.transitionDelay = `${index * 0.1}s`;
        }
        revealObserver.observe(el);
    });

    // Modal Logic
    const modals = document.querySelectorAll('.modal-overlay');
    const modalTriggers = document.querySelectorAll('.trigger-modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const targetModal = document.querySelector(targetId);
            if(targetModal) {
                targetModal.classList.add('active');
            }
        });
    });

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-overlay');
            if(modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close when clicking outside of modal
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // WhatsApp Form Integration
    const waForm = document.getElementById('whatsapp-form');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wa-name').value;
            const email = document.getElementById('wa-email').value;
            const message = document.getElementById('wa-message').value;
            
            const textToEncode = `Hi Pastel Remote AI,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const waText = encodeURIComponent(textToEncode);
            
            const waUrl = `https://wa.me/918681916356?text=${waText}`;
            window.open(waUrl, '_blank');
        });
    }

    // Initialize Magic Canvas Animation
    initMagicCanvas();
});

// Antigravity & Pastel Magic Canvas Animation
function initMagicCanvas() {
    const canvas = document.getElementById('magic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    const mouse = {
        x: null,
        y: null,
        radius: 200 // Antigravity repulsion field
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Pastel color palette for particles
    const pastelColors = [
        'rgba(255, 154, 158, 0.8)', // Pastel Pink
        'rgba(143, 211, 244, 0.8)', // Pastel Blue
        'rgba(161, 196, 253, 0.8)', // Light Periwinkle
        'rgba(253, 203, 241, 0.8)'  // Soft Lavender
    ];
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1.5;
            this.baseSize = this.size;
            
            this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Antigravity force
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Repel - push particles away from cursor
                    const repel = force * 5; 
                    
                    this.x -= forceDirectionX * repel;
                    this.y -= forceDirectionY * repel;
                    this.size = this.baseSize * (1 + force * 2); 
                } else {
                    this.size = this.baseSize;
                }
            } else {
                this.size = this.baseSize;
            }
            
            this.draw();
        }
    }
    
    function init() {
        particles = [];
        const numParticles = Math.min(Math.floor((width * height) / 10000), 120);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = (dx * dx) + (dy * dy);
                
                if (distance < 12000) {
                    let opacityValue = 1 - (distance / 12000);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(143, 211, 244, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}
