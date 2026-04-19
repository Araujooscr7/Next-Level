// ========== CANVAS LEVE (partículas otimizadas) ==========
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

window.addEventListener('resize', () => { resizeCanvas(); });
resizeCanvas();
drawParticles();

// ========== MENU MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' ? false : true;
        menuToggle.setAttribute('aria-expanded', expanded);
        navLinks.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// ========== TOAST ==========
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ========== FORMULÁRIO DE LEAD (simulação) ==========
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('leadEmail').value.trim();
        if (!email || !email.includes('@')) {
            showToast('Por favor, insira um e-mail válido.', 3000);
            return;
        }
        showToast('📡 Enviando blueprint...');
        setTimeout(() => {
            showToast(`✨ Blueprint enviado para ${email}! Verifique sua caixa de entrada.`, 4000);
            leadForm.reset();
        }, 800);
    });
}

// ========== MURAL COLABORATIVO (localStorage) ==========
let suggestions = JSON.parse(localStorage.getItem('nextlevel_suggestions')) || [];

function renderSuggestions() {
    const container = document.getElementById('suggestionsList');
    if (!container) return;
    container.innerHTML = '';
    suggestions.forEach((sugg, idx) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <span class="suggestion-text">💡 ${escapeHtml(sugg.text)}</span>
            <button class="delete-suggestion" data-index="${idx}" aria-label="Remover sugestão">🗑️</button>
        `;
        container.appendChild(div);
    });
    document.querySelectorAll('.delete-suggestion').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            suggestions.splice(index, 1);
            localStorage.setItem('nextlevel_suggestions', JSON.stringify(suggestions));
            renderSuggestions();
            showToast('Sugestão removida', 2000);
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

const postBtn = document.getElementById('postSuggestionBtn');
const suggestionInput = document.getElementById('suggestionInput');
if (postBtn) {
    postBtn.addEventListener('click', () => {
        const text = suggestionInput.value.trim();
        if (text === '') {
            showToast('Escreva uma sugestão antes de publicar', 2500);
            return;
        }
        suggestions.push({ text, date: new Date().toISOString() });
        localStorage.setItem('nextlevel_suggestions', JSON.stringify(suggestions));
        renderSuggestions();
        suggestionInput.value = '';
        showToast('Sugestão publicada no mural!', 2500);
    });
}
renderSuggestions();

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
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#EFF2FC' } } }
            }
        });
    }, 100);
}
function closeAnalyticsModalFunc() {
    if (analyticsModal) analyticsModal.style.display = 'none';
}
if (openAnalyticsBtn) openAnalyticsBtn.addEventListener('click', openAnalyticsModalFunc);
if (closeAnalyticsSpan) closeAnalyticsSpan.addEventListener('click', closeAnalyticsModalFunc);
window.addEventListener('click', (e) => { if (e.target === analyticsModal) closeAnalyticsModalFunc(); });

// ========== SCROLL SMOOTH ==========
document.getElementById('scrollToSolucoes')?.addEventListener('click', () => {
    document.getElementById('solucoes').scrollIntoView({ behavior: 'smooth' });
});

// ========== ANIMAÇÃO DE REVELAÇÃO ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.solution-card, .diff-stats, .community-hub, .mural-section, .modular-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========== PWA: SERVICE WORKER ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service Worker registrado', reg);
    }).catch(err => {
        console.log('Falha no Service Worker', err);
    });
}

console.log('Next Level v2.0 - Base digital completa!');

navigator.serviceWorker.register('./sw.js')  // ou '/sw.js'
