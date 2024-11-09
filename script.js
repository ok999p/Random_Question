const questions = [
  "คุณชอบอาหารชนิดไหนที่สุด?",
  "ถ้าได้เป็นนักร้อง, เพลงใดคือเพลงที่คุณอยากจะแสดง?",
  "อาชีพในอนาคตของคุณคืออะไร?",
  "วิธีการผ่อนคลายที่คุณชอบที่สุดคือ?",
  "ถ้าคุณสามารถไปที่ไหนก็ได้ในโลก, คุณจะเลือกไปที่ไหน?",
  "สิ่งที่คุณกลัวที่สุดคืออะไร?",
  "คุณมีฮีโร่ในชีวิตจริงหรือไม่? ใครคือฮีโร่ของคุณ?",
  "ความทรงจำที่คุณมีความสุขที่สุดในชีวิตคืออะไร?",
  "ถ้าคุณสามารถเปลี่ยนอะไรบางอย่างในอดีตได้, คุณจะเลือกเปลี่ยนอะไร?",
  "สัตว์อะไรที่สะท้อนถึงบุคลิกภาพของคุณมากที่สุด?",
  "ถ้าคุณสามารถมีพลังพิเศษใดก็ได้, คุณอยากได้พลังอะไร?",
  "สิ่งที่คุณภูมิใจที่สุดในชีวิตคืออะไร?",
  "คุณคิดว่าคุณจะเป็นคนแบบไหนในอีก 10 ปีข้างหน้า?",
  "หนังสือเล่มใดที่มีอิทธิพลต่อชีวิตของคุณมากที่สุด?",
  "สิ่งที่คุณต้องการทำให้สำเร็จในปีนี้คืออะไร?",
  "ถ้าคุณสามารถกินได้แค่อาหารชนิดเดียวตลอดไป, คุณจะเลือกอะไร?",
  "ดนตรีประเภทไหนที่คุณชอบฟังมากที่สุด?",
  "คุณคิดว่าความหมายของความสุขคืออะไร?",
  "ถ้ามีเวลาและทรัพยากรไม่จำกัด, คุณจะทำอะไรเพื่อพัฒนาชุมชนของคุณ?"
];


let isSpinning = false;
let animationFrame;
let selectedQuestion = "";
let usedQuestions = new Set();
let lightSpeed = 4; // ความเร็วเริ่มต้นของแสง (หน่วยเป็นวินาที)
const MAX_LENGTH = 25; // กำหนดความยาวสูงสุดเป็น 25

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
  const animationLength = Math.min(selectedQuestion.length, MAX_LENGTH);

  function spin() {
      if (!isSpinning) return;
      element.innerText = Array(animationLength).fill()
          .map(() => thaiChars[Math.floor(Math.random() * thaiChars.length)])
          .join("");
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
      const progress = (Date.now() - startTime) / duration;
      const step = Math.round(progress * steps);
      const currentLength = Math.min(MAX_LENGTH + Math.floor(progress * (steps - MAX_LENGTH)), steps);

      element.innerText = letters
          .slice(0, currentLength)
          .map((s, i) => (i < step ? s : random()))
          .join("");

      if (progress >= 1) {
          cancelAnimationFrame(animationFrame);
      } else {
          animationFrame = requestAnimationFrame(animate);
      }
  }
  animate();
}

function toggleSpinning() {
    const button = document.getElementById('generateButton');
    const goldenLight = document.querySelector('.golden-light');

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
        
        // เพิ่มความเร็วของแสง
        lightSpeed = 0.5; // ความเร็วสูงสุดของแสง
        goldenLight.style.setProperty('--light-speed', `${lightSpeed}s`);
        goldenLight.classList.add('spinning');
    } else {
        button.textContent = 'Generate Question';
        stopSpinning();
        
        // ค่อยๆ ลดความเร็วของแสง
        slowDownLight();
    }
}

function slowDownLight() {
    const goldenLight = document.querySelector('.golden-light');
    
    if (lightSpeed < 4) {
        lightSpeed += 0.2;
        goldenLight.style.setProperty('--light-speed', `${lightSpeed}s`);
        requestAnimationFrame(slowDownLight);
    } else {
        goldenLight.classList.remove('spinning');
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

/* ---- particles.js config ---- */

particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area":1000
        }
      },
      "color": {
        "value": ["#aa73ff", "#f8c210", "#83d238", "#33b1f8"]
      },
      
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#fff"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.6,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 120,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": false
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });


  let countdown;
  let timeLeft = 5; // ตั้งค่าเวลาเริ่มต้นที่ 2 นาที (120 วินาที)
  let beepInterval; // กำหนดตัวแปรสำหรับเก็บการวนซ้ำเสียง beep
  
  // ฟังก์ชันอัปเดตการแสดงผลของเวลา
  function updateTimerDisplay() {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      document.getElementById('timerDisplay').innerText = `${minutes}:${seconds}`;
  }
  
  // ฟังก์ชันเริ่มจับเวลา
  function startTimer() {
      if (countdown) clearInterval(countdown);
      countdown = setInterval(() => {
          if (timeLeft > 0) {
              timeLeft--;
              updateTimerDisplay();
          } else {
              clearInterval(countdown);
              playBeepSound(); // เล่นเสียงเมื่อหมดเวลา
          }
      }, 1000);
  }
  
  // ฟังก์ชันเล่นเสียงเมื่อหมดเวลา
  function playBeepSound() {
    const beepSound = new Audio('./Beep2.mp3');
    beepSound.play();
    // ตั้งให้เสียง beep ทำงานซ้ำทุก 5 วินาที
    beepInterval = setInterval(() => {
        beepSound.play();
    }, 500);
}
  
  // ฟังก์ชันหยุดจับเวลา
  function stopTimer() {
    clearInterval(countdown);
    clearInterval(beepInterval); // หยุดเสียง beep ที่วนซ้ำ
}
  
  // ฟังก์ชันรีเซ็ตเวลา
  function resetTimer() {
      timeLeft = 5; // ตั้งกลับเป็น 2 นาที
      updateTimerDisplay();
      clearInterval(beepInterval); // หยุดเสียง beep ที่วนซ้ำ
  }
  
  // กำหนดการทำงานของปุ่ม
  document.getElementById('startTimerButton').addEventListener('click', startTimer);
  document.getElementById('stopTimerButton').addEventListener('click', stopTimer);
  document.getElementById('resetTimerButton').addEventListener('click', resetTimer);
  
  // เรียกฟังก์ชันแสดงเวลาเริ่มต้นทันทีเมื่อโหลดหน้าเว็บ
  updateTimerDisplay();
  


function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const timerDisplay = document.getElementById('timerDisplay');

  // เพิ่มแอนิเมชันทุกครั้งที่เวลาถอยหลัง
  timerDisplay.classList.add('pulse');
  timerDisplay.innerText = `${minutes}:${seconds}`;

  // ลบคลาส 'pulse' หลังจากแอนิเมชันจบ
  setTimeout(() => {
      timerDisplay.classList.remove('pulse');
  }, 500);
}


function resetQuestion() {
  Swal.fire({
      title: 'ต้องการรีเซ็ตคำถามจริงๆ หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
  }).then((result) => {
      if (result.isConfirmed) {
          const questionDisplay = document.getElementById('questionDisplay');
          questionDisplay.innerText = "คำถามสำหรับ ดาวเดือน"; // ตั้งค่าคำถามเริ่มต้น
          usedQuestions.clear(); // ล้างชุดคำถามที่เคยใช้ไปแล้ว
          document.getElementById('generateButton').disabled = false; // เปิดใช้งานปุ่มสุ่มคำถามอีกครั้ง

          Swal.fire({
              title: 'รีเซ็ตคำถามเรียบร้อยแล้ว!',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#3085d6',
          });
      }
  });
}

document.getElementById('resetQuestionButton').addEventListener('click', resetQuestion);
