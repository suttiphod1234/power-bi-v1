/**
 * Power BI T4 Quiz Logic (Power BI Foundation - 25 Questions)
 */

// REPLACE THIS with your T4 Google Apps Script Web App URL after deployment
const scriptURL = 'https://script.google.com/macros/s/AKfycbzaQU2YSM9Jket2qaBUlvQUeOSgxGCPOUIL_lOEl7fJjXmoT3C022qCJULxfVY_iQ/exec';

const form = document.getElementById('t4Form');
const modal = document.getElementById('successModal');
const finalScoreSpan = document.getElementById('finalScore');

// Correct Answers for T4 Quiz (25 Questions)
const correctAnswers = {
    q1: 'ค', q2: 'ข', q3: 'ข', q4: 'ง', q5: 'ค',
    q6: 'ข', q7: 'ก', q8: 'ค', q9: 'ข', q10: 'ข',
    q11: 'ข', q12: 'ข', q13: 'ก', q14: 'ข', q15: 'ข',
    q16: 'ข', q17: 'ข', q18: 'ข', q19: 'ข', q20: 'ข',
    q21: 'ข', q22: 'ก', q23: 'ข', q24: 'ข', q25: 'ข'
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

        // Calculate Score for 25 questions
        for (const [key, value] of Object.entries(correctAnswers)) {
            if (formData.get(key) === value) {
                score++;
            }
        }

        // Prepare Data
        formData.append('score', score);
        formData.append('sheetName', 'T4'); // Identifier for the sheet tab

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
