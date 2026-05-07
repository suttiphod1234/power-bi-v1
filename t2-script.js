/**
 * Power BI T2 Quiz Logic (Power BI Visuals)
 */

// REPLACE THIS with your T2 Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbwnrV4UYj44ePZ96K5ENhOVp5UfZZjm89eQBjZ_3YP8T1z6hb-aNClshQvpZddtS5Zh/exec';

const form = document.getElementById('t2Form');
const modal = document.getElementById('successModal');
const finalScoreSpan = document.getElementById('finalScore');

// Correct Answers for T2 Quiz
const correctAnswers = {
    q1: 'ก',
    q2: 'ข',
    q3: 'ค',
    q4: 'ข',
    q5: 'ก',
    q6: 'ข',
    q7: 'ก',
    q8: 'ข',
    q9: 'ก',
    q10: 'ข'
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
        formData.append('sheetName', 'T2'); // Identifier for the sheet tab

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
