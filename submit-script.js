/**
 * Power BI Submit Work Logic
 */

// !สำคัญ: ให้นำ URL ของ Web App จาก Google Apps Script ที่ Deploy แล้วมาวางแทนที่ลิงก์ด้านล่างนี้
const scriptURL = 'https://script.google.com/macros/s/AKfycbyW5wwnOPNhyOjXINIDSDJkLtP38cumv2HFfRk2052FCTfCKFPaUDqzA1iRCu9-MAe9eg/exec';

const form = document.getElementById('submitForm');
const modal = document.getElementById('successModal');

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
        formData.append('sheetName', 'Submit_Work'); // ชื่อ Sheet (Tab) ที่จะบันทึกข้อมูลผลงาน

        // Send Data to Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (response.ok) {
            openModal();
            form.reset();
        } else {
            throw new Error('การส่งข้อมูลขัดข้อง กรุณาลองใหม่อีกครั้ง');
        }

    } catch (error) {
        console.error('Error!', error.message);
        alert('ขออภัย เกิดข้อผิดพลาด: ' + error.message + '\nกรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือ URL ของ Script ที่คุณ Deployment ว่าถูกต้องหรือไม่');
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
