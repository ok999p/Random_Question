const questions = [
    "คุณชอบอาหารชนิดไหนที่สุด?",
    "ถ้าได้เป็นนักร้อง, เพลงใดคือเพลงที่คุณอยากจะแสดง?",
    "อาชีพในอนาคตของคุณคืออะไร?",
    "วิธีการผ่อนคลายที่คุณชอบที่สุดคือ?",
    "ถ้าคุณได้เป็นเทพเจ้าของภูเขา, คุณจะทำอะไร?",
    "อาหารเช้าที่คุณชอบมักจะเป็นแบบไหน?",
    "สิ่งที่คุณเก็บรวบรวมมากที่สุดคืออะไร?",
    "ถ้าคุณมีโอกาสไปท่องเที่ยวที่มหาสมุทรสีดา, คุณจะทำอะไร?",
    "คุณชอบภาพยนตร์แนวไหนที่สุด?",
    "ถ้าคุณได้เป็นนักสืบ, คุณจะแก้คดีอะไรก่อนอื่น?",
    "อาหารเย็นที่คุณชอบมักจะเป็นแบบไหน?",
    "สิ่งที่คุณอยากทำในชีวิตอันแรกคืออะไร?",
    "ถ้าคุณได้พบกับมนุษย์ต่างดาว, คุณจะถามอะไร?",
    "วิธีการออกกำลังกายที่คุณชอบที่สุดคือ?",
    "คุณชอบสัตว์เลี้ยงชนิด"
];

let currentIndex = 0;

// เช็คและโหลดคำถามจาก localStorage
function loadQuestionsFromCache() {
    const cachedQuestions = localStorage.getItem('cachedQuestions');
    if (cachedQuestions) {
        questions = JSON.parse(cachedQuestions);
        return true;
    }
    return false;
}

// โหลดคำถามเพิ่มเติม
async function loadMoreQuestions() {
    // สมมติว่าเรามี API ที่ส่งคำถามกลับมาเป็นชุด
    // ในกรณีนี้เราจะจำลองโดยใช้คำถามที่มีอยู่
    const newQuestions = [
        "คุณชอบอาหารชนิดไหนที่สุด?",
        "ถ้าได้เป็นนักร้อง, เพลงใดคือเพลงที่คุณอยากจะแสดง?",
        // ... (คำถามอื่นๆ)
    ];
    questions = questions.concat(newQuestions);

    // บันทึกคำถามลงใน localStorage
    localStorage.setItem('cachedQuestions', JSON.stringify(questions));
}

function generateQuestion() {
    if (currentIndex >= questions.length - 5) {
        loadMoreQuestions();
    }
    const question = questions[currentIndex];
    currentIndex++;
    animateQuestion(question);
}


function animateQuestion(question) {
    const element = document.getElementById('questionDisplay');
    const startTime = Date.now();
    const duration = 2000;
    const letters = question.split("");
    const steps = letters.length;

    const map = (n, x1, y1, x2, y2) => Math.min(Math.max(((n - x1) * (y2 - x2)) / (y1 - x1) + x2, x2), y2);

    const thaiChars = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ";
    const random = () => thaiChars[Math.floor(Math.random() * thaiChars.length)];

    let frame;

    (function animate() {
        frame = requestAnimationFrame(animate);

        const step = Math.round(map(Date.now() - startTime, 0, duration, 0, steps));

        element.innerText = letters
            .map((s, i) => (step - 1 >= i ? letters[i] : random()))
            .join("");

        if (step >= steps) {
            cancelAnimationFrame(frame);
        }
    })();
}
// เริ่มต้นโปรแกรม
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('generateButton');
    button.addEventListener('click', generateQuestion);

    if (!loadQuestionsFromCache()) {
        loadMoreQuestions();
    }
});