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

const scaleLabels = [
    "Совсем нет",
    "Скорее нет",
    "Нейтрально",
    "Скорее да",
    "Полностью да"
];

const form = document.getElementById('testForm');
const submitBtn = document.getElementById('submitBtn');
const result = document.getElementById('result');

// Генерация вопросов
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
    form.appendChild(qDiv);
});

// Активация кнопки при заполнении
form.addEventListener('change', () => {
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    submitBtn.disabled = answered < questions.length;
});

// Подсчёт результата
submitBtn.addEventListener('click', () => {
    let total = 0;
    questions.forEach((_, i) => {
        const checked = document.querySelector(`input[name="q${i}"]:checked`);
        if (checked) total += parseInt(checked.value);
    });

    showResult(total);
});

function showResult(score) {
    form.style.display = 'none';
    submitBtn.style.display = 'none';
    result.classList.remove('hidden');

    document.getElementById('scoreValue').textContent = score;

    let title, text;
    if (score >= 42) {
        title = "🏆 Высокая сплоченность";
        text = "Ваша команда — настоящий монолит! Высокий уровень доверия, общая цель и взаимная поддержка делают вас очень эффективными. Продолжайте укреплять связи через совместные успехи и неформальное общение.";
    } else if (score >= 30) {
        title = "✨ Средняя сплоченность";
        text = "Команда работает неплохо, но есть потенциал для роста. Обратите внимание на открытость коммуникации, распределение ролей и создание традиций, которые усилят чувство принадлежности.";
    } else if (score >= 18) {
        title = "⚠️ Ниже среднего";
        text = "В команде чувствуется разобщенность. Стоит поработать над доверием, ясными целями и совместными активностями. Помогут тимбилдинги, ролевые игры и регулярные ретроспективы.";
    } else {
        title = "🚨 Низкая сплоченность";
        text = "Команда находится в критическом состоянии. Необходимо срочно работать над базовыми вещами: общей целью, ролевой структурой и психологической безопасностью. Рекомендуется пригласить фасилитатора.";
    }

    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultText').textContent = text;
}

// Рестарт
document.getElementById('restartBtn').addEventListener('click', () => {
    form.reset();
    form.style.display = 'flex';
    submitBtn.style.display = 'inline-block';
    submitBtn.disabled = true;
    result.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
