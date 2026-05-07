/**
 * Power BI T1 Quiz Logic (Power BI Desktop Foundation)
 */

// REPLACE THIS with your T1 Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbze3P2YDa5be_9bk9mCrSn4v-zbyF7QyLoyGrPpae8YZKpylNjZfOjf9QPC81ytnXuO/exec';

const form = document.getElementById('t1Form');
const modal = document.getElementById('successModal');
const finalScoreSpan = document.getElementById('finalScore');

// Correct Answers for T1 Quiz
const correctAnswers = {
    q1: 'ข',
    q2: 'ค',
    q3: 'ข',
    q4: 'ข',
    q5: 'ข',
    q6: 'ข',
    q7: 'ก',
    q8: 'ข',
    q9: 'ข',
    q10: 'ก'
};

/**
 * Handle Form Submission
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = 'กำลังส่งข้อมูล...';

    try {
        const formData = new FormData(form);
        let score = 0;

        // Calculate Score for 10 questions
        for (const [key, value] of Object.entries(correctAnswers)) {
            if (formData.get(key) === value) {
                score++;
            }
        }

        // Prepare Data
        formData.append('score', score);
        formData.append('sheetName', 'T1'); // Identifier for the sheet tab

        // Send Data to Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (response.ok) {
            finalScoreSpan.innerText = score;
            openModal();
            form.reset();
        } else {
            throw new Error('การส่งข้อมูลขัดข้อง กรุณาลองใหม่อีกครั้ง');
        }

    } catch (error) {
        console.error('Error!', error.message);
        alert('ขออภัย เกิดข้อผิดพลาด: ' + error.message + '\nกรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือ URL ของ Script ที่คุณ Deployment');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }
});

/**
 * Modal Controls
 */
function openModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}
