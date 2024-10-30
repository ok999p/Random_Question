const questions = [
    "คุณชอบอาหารชนิดไหนที่สุด?",
    "ถ้าได้เป็นนักร้อง, เพลงใดคือเพลงที่คุณอยากจะแสดง?",
    "อาชีพในอนาคตของคุณคืออะไร?",
    "วิธีการผ่อนคลายที่คุณชอบที่สุดคือ?",
];

let isSpinning = false;
let animationFrame;
let selectedQuestion = "";
let usedQuestions = new Set();

function getRandomQuestion() {
    const availableQuestions = questions.filter(q => !usedQuestions.has(q));
    if (availableQuestions.length === 0) {
        return "หมดคำถาม";
    }
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    usedQuestions.add(question);
    return question;
}

function animateSpinning() {
    const element = document.getElementById('questionDisplay');
    const thaiChars = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ";
    const questionLength = selectedQuestion.length;
    function spin() {
        if (!isSpinning) return;
        element.innerText = Array(questionLength).fill().map(() => thaiChars[Math.floor(Math.random() * thaiChars.length)]).join("");
        animationFrame = requestAnimationFrame(spin);
    }
    spin();
}

function stopSpinning() {
    isSpinning = false;
    cancelAnimationFrame(animationFrame);
    animateFinalQuestion(selectedQuestion);
}

function animateFinalQuestion(question) {
    const element = document.getElementById('questionDisplay');
    const startTime = Date.now();
    const duration = 2000;
    const letters = question.split("");
    const steps = letters.length;
    const map = (n, x1, y1, x2, y2) => Math.min(Math.max(((n - x1) * (y2 - x2)) / (y1 - x1) + x2, x2), y2);
    const thaiChars = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ";
    const random = () => thaiChars[Math.floor(Math.random() * thaiChars.length)];
    function animate() {
        const step = Math.round(map(Date.now() - startTime, 0, duration, 0, steps));
        element.innerText = letters
            .map((s, i) => (step - 1 >= i ? letters[i] : random()))
            .join("");
        if (step >= steps) {
            cancelAnimationFrame(animationFrame);
        } else {
            animationFrame = requestAnimationFrame(animate);
        }
    }
    animate();
}

function toggleSpinning() {
    const button = document.getElementById('generateButton');
    if (!isSpinning) {
        selectedQuestion = getRandomQuestion();
        if (selectedQuestion === "หมดคำถาม") {
            document.getElementById('questionDisplay').innerText = selectedQuestion;
            button.disabled = true;
            return;
        }
        isSpinning = true;
        button.textContent = 'Stop';
        animateSpinning();
    } else {
        button.textContent = 'Generate Question';
        stopSpinning();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('generateButton');
    button.addEventListener('click', toggleSpinning);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            toggleSpinning();
        }
    });
});