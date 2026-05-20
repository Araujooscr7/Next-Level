// ========== MENU MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== PARTICLES FOOTER ==========
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        console.log('Canvas não encontrado! Verifique o ID no HTML.');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const footer = canvas.parentElement;
        if (!footer) return;
        canvas.width = footer.offsetWidth || window.innerWidth;
        canvas.height = footer.offsetHeight || 400;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 80;
    
    function getWorldY(x) {
        const centerX = canvas.width / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        const dx = x - centerX;
        const distance = Math.abs(dx);
        if (distance > radius) return canvas.height + 100;
        const y = canvas.height - (Math.sqrt(radius * radius - distance * distance) * 1.2);
        return y - 50;
    }
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = getWorldY(x) + (Math.random() - 0.5) * 60;
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 2.5 + 1.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.6 + 0.3,
            pulse: Math.random() * Math.PI * 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.02;
            const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.fill();
            
            const worldY = getWorldY(p.x);
            if (p.y > worldY + 100 || p.y < worldY - 100 || p.x < -50 || p.x > canvas.width + 50) {
                const newX = Math.random() * canvas.width;
                p.x = newX;
                p.y = getWorldY(newX) + (Math.random() - 0.5) * 40;
            }
        });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 102, 255, ${0.08 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
