// ========== CANVAS ==========
const canvas = document.getElementById('orbCanvas');
let ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const PARTICLE_COUNT = 40;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.15,
            color: `rgba(110, 86, 255, ${Math.random() * 0.4 + 0.2})`
        });
    }
}

function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
    }
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => resizeCanvas());
resizeCanvas();
drawParticles();

// ========== MENU MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ========== TOAST ==========
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ========== FORMULÁRIO ==========
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('leadEmail').value.trim();
        if (!email || !email.includes('@')) {
            showToast('E-mail inválido', 3000);
            return;
        }
        showToast('📡 Enviando...');
        setTimeout(() => {
            showToast(`✅ Blueprint enviado para ${email}!`, 4000);
            leadForm.reset();
        }, 800);
    });
}

// ========== MODAL TIME ==========
const modal = document.getElementById('teamModal');
const openBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeSpan = document.querySelector('.close-modal');
function openModal() { if(modal) modal.style.display = 'flex'; }
function closeModalFunc() { if(modal) modal.style.display = 'none'; }
if (openBtn) openBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModalFunc);
if (closeSpan) closeSpan.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });

// ========== MODAL ANALYTICS ==========
const analyticsModal = document.getElementById('analyticsModal');
const openAnalyticsBtn = document.getElementById('openAnalyticsPreview');
const closeAnalyticsSpan = document.querySelector('.close-analytics-modal');
let chartInstance = null;
function openAnalyticsModalFunc() {
    if (!analyticsModal) return;
    analyticsModal.style.display = 'flex';
    setTimeout(() => {
        const ctxChart = document.getElementById('previewChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctxChart, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Engajamento (%)',
                    data: [65, 72, 78, 81, 89, 94],
                    borderColor: '#6E56FF',
                    backgroundColor: 'rgba(110,86,255,0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#EFF2FC' } } } }
        });
    }, 100);
}
function closeAnalyticsModalFunc() { if (analyticsModal) analyticsModal.style.display = 'none'; }
if (openAnalyticsBtn) openAnalyticsBtn.addEventListener('click', openAnalyticsModalFunc);
if (closeAnalyticsSpan) closeAnalyticsSpan.addEventListener('click', closeAnalyticsModalFunc);
window.addEventListener('click', (e) => { if (e.target === analyticsModal) closeAnalyticsModalFunc(); });

// ========== SCROLL ==========
document.getElementById('scrollToSolucoes')?.addEventListener('click', () => {
    document.getElementById('solucoes').scrollIntoView({ behavior: 'smooth' });
});

// ========== ANIMAÇÃO REVELAÇÃO ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.solution-card, .pilar-card, .team-card, .lead-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('Next Level site pronto - sem Service Worker para facilitar deploy');
