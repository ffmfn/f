/* ============================================
   ЧАСТЬ 1: ПРЕЗЕНТАЦИЯ
   ============================================ */

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideEl = document.getElementById('currentSlide');
const totalSlidesEl = document.getElementById('totalSlides');
const progressFill = document.getElementById('progressFill');
const dotsContainer = document.getElementById('dots');

let currentSlide = 1;

// Инициализация
if (totalSlidesEl) totalSlidesEl.textContent = totalSlides;

// Создание точек
if (dotsContainer) {
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 1) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(n) {
    if (n < 1 || n > totalSlides) return;
    
    slides.forEach(s => {
        const slideNum = parseInt(s.dataset.slide);
        s.classList.remove('active', 'prev');
        if (slideNum < n) s.classList.add('prev');
    });
    
    const target = document.querySelector(`[data-slide="${n}"]`);
    target.classList.add('active');
    
    currentSlide = n;
    updateUI();
    
    // Генерация QR на последнем слайде
    if (n === totalSlides) generateQR();
}

function updateUI() {
    if (currentSlideEl) currentSlideEl.textContent = currentSlide;
    if (progressFill) progressFill.style.width = `${(currentSlide / totalSlides) * 100}%`;
    
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i + 1 === currentSlide);
    });
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Клавиатура
document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('test-page')) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
    }
    if (e.key === 'Home') goToSlide(1);
    if (e.key === 'End') goToSlide(totalSlides);
});

// Свайпы
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', (e) => {
    if (document.body.classList.contains('test-page')) return;
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 60) {
        if (diff < 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
    }
});

// Колесо мыши (с защитой от случайных срабатываний)
let wheelLock = false;
document.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('test-page')) return;
    if (wheelLock) return;
    wheelLock = true;
    setTimeout(() => wheelLock = false, 800);
    
    if (e.deltaY > 30) goToSlide(currentSlide + 1);
    else if (e.deltaY < -30) goToSlide(currentSlide - 1);
}, { passive: true });

// QR-код
function generateQR() {
    const qrDiv = document.getElementById('qrcode');
    const qrUrl = document.getElementById('qrUrl');
    if (!qrDiv || qrDiv.dataset.generated) return;
    
    const testUrl = window.location.href.replace(/index\.html$/, '').replace(/\/$/, '') + '/test.html';
    if (qrUrl) qrUrl.textContent = testUrl;
    
    try {
        new QRCode(qrDiv, {
            text: testUrl,
            width: 220,
            height: 220,
            colorDark: "#0a0a18",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        qrDiv.dataset.generated = 'true';
    } catch (err) {
        console.error('QR generation error:', err);
    }
}

// Инициализация первого слайда
if (slides.length > 0) {
    goToSlide(1);
}

/* ============================================
   ЧАСТЬ 2: ТЕСТ
   ============================================ */

const testForm = document.getElementById('testForm');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');

if (testForm) {
    const questions = [
        "Члены нашей команды открыто делятся идеями и мнениями.",
        "Мы чувствуем общую ответственность за результат.",
        "В команде царит атмосфера доверия и взаимной поддержки.",
        "Каждый понимает свою роль и вклад в общий успех.",
        "Мы легко разрешаем возникающие разногласия.",
        "Члены команды гордятся принадлежностью к группе.",
        "Мы регулярно помогаем друг другу в сложных задачах.",
        "Наша команда эффективно достигает поставленных целей.",
        "В коллективе существует неформальное общение и дружба.",
        "Я чувствую, что мои усилия в команде ценятся."
    ];
    
    const scaleLabels = ["Совсем нет", "Скорее нет", "Нейтрально", "Скорее да", "Полностью да"];
    
    questions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.innerHTML = `
            <div class="question-text">${i + 1}. ${q}</div>
            <div class="scale">
                ${scaleLabels.map((label, val) => `
                    <label>
                        <input type="radio" name="q${i}" value="${val + 1}" required>
                        <span>${label}</span>
                    </label>
                `).join('')}
            </div>
        `;
        testForm.appendChild(qDiv);
    });
    
    testForm.addEventListener('change', () => {
        const answered = document.querySelectorAll('input[type="radio"]:checked').length;
        submitBtn.disabled = answered < questions.length;
    });
    
    submitBtn.addEventListener('click', () => {
        let total = 0;
        questions.forEach((_, i) => {
            const checked = document.querySelector(`input[name="q${i}"]:checked`);
            if (checked) total += parseInt(checked.value);
        });
        showResult(total);
    });
    
    function showResult(score) {
        testForm.style.display = 'none';
        submitBtn.parentElement.style.display = 'none';
        resultDiv.classList.remove('hidden');
        
        document.getElementById('scoreValue').textContent = score;
        
        let title, text;
        if (score >= 42) {
            title = "🏆 Высокая сплоченность";
            text = "Ваша команда — настоящий монолит! Высокий уровень доверия, общая цель и взаимная поддержка делают вас очень эффективными.";
        } else if (score >= 30) {
            title = "✨ Средняя сплоченность";
            text = "Команда работает неплохо, но есть потенциал для роста. Обратите внимание на открытость коммуникации и совместные традиции.";
        } else if (score >= 18) {
            title = "⚠️ Ниже среднего";
            text = "В команде чувствуется разобщенность. Стоит поработать над доверием, ясными целями и совместными активностями.";
        } else {
            title = "🚨 Низкая сплоченность";
            text = "Команда в критическом состоянии. Необходимо срочно работать над общей целью, ролевой структурой и психологической безопасностью.";
        }
        
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultText').textContent = text;
    }
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        testForm.reset();
        testForm.style.display = 'flex';
        submitBtn.parentElement.style.display = 'block';
        submitBtn.disabled = true;
        resultDiv.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
