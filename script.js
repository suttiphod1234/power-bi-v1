/**
 * Power BI Pre-test Form Logic
 */

// REPLACE THIS with your actual Google Apps Script Web App URL after deployment
const scriptURL = 'https://script.google.com/macros/s/AKfycbxaWlaZb6i4_78BXbpttB9ZDzzMyh1RkDiTyO15VgQtJXkEzfy6heIyIwbW7RMSrFhn/exec';

const form = document.getElementById('pretestForm');
const modal = document.getElementById('successModal');
const finalScoreSpan = document.getElementById('finalScore');
const interestsGrid = document.getElementById('interestsGrid');

// Correct Answers for Quiz (Easiest Version)
const correctAnswers = {
    q1: 'ค', // ตัวเลขและข้อมูล
    q2: 'ข', // รูปกราฟและแผนภูมิ
    q3: 'ข', // หน้าจอเดียวที่รวมสรุปข้อมูลสำคัญไว้ทั้งหมด
    q4: 'ค', // แก้ข้อมูลปุ๊บ กราฟก็เปลี่ยนตามให้ทันที ไม่ต้องวาดใหม่
    q5: 'ค'  // มือถือ หรือ แท็บเล็ต
};

// Limit interests selection to 5
interestsGrid.addEventListener('change', (e) => {
    const checked = interestsGrid.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length > 5) {
        e.target.checked = false;
        alert('คุณสามารถเลือกหัวข้อที่สนใจได้สูงสุด 5 ข้อครับ');
    }
});

/**
 * Handle Form Submission
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Show Loading State
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = 'กำลังส่งข้อมูล...';

    try {
        // 2. Calculate Score
        const formData = new FormData(form);
        let score = 0;
        for (const [key, value] of Object.entries(correctAnswers)) {
            if (formData.get(key) === value) {
                score++;
            }
        }

        // 3. Prepare Data for Sheets
        const interests = Array.from(interestsGrid.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value)
            .join(', ');

        // Append extra data to form
        formData.append('score', score);
        formData.append('interests', interests);

        // 4. Send Data to Google Apps Script
        // Note: Using fetch with URLSearchParams or FormData depending on CORS setup
        // For Google Apps Script, we often need to use x-www-form-urlencoded or handle redirects
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        // 5. Handle Result
        if (response.ok) {
            finalScoreSpan.innerText = score;
            openModal();
            form.reset();
        } else {
            throw new Error('การส่งข้อมูลขัดข้อง กรุณาลองใหม่อีกครั้ง');
        }

    } catch (error) {
        console.error('Error!', error.message);
        alert('ขออภัย เกิดข้อผิดพลาด: ' + error.message + '\nกรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือ URL ของ Script');
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

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}
