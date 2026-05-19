/**
 * Google Apps Script for Power BI Submit Work
 * ให้เชื่อมกับ Google Sheet ไฟล์เดิมที่คุณมี
 * Sheet Tab Name ที่จะถูกสร้าง/บันทึกคือ: Submit_Work
 */

function doPost(e) {
  var sheetName = "Submit_Work";
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1J0SQmAZxCweHds1My_s9ENBdaHYGVX6YqVGym74pcqU/edit?usp=sharing");
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Set Headers for Submit Work
    var headers = [
      "Timestamp", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "ตำแหน่งงานปัจจุบัน", 
      "ลิงก์ผลงาน", "ข้อเสนอแนะเพิ่มเติม"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  try {
    var data = e.parameter;
    var timestamp = new Date();
    
    var row = [
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.job,
      data.workLink,
      data.comments || ""
    ];
    
    sheet.appendRow(row);

    // Send Email Notification
    if (data.email) {
      sendSubmitEmail(data.email, data.name, data.workLink);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "row": sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendSubmitEmail(email, name, workLink) {
  var subject = "ยืนยันการส่งผลงาน Power BI - " + name;
  var body = "สวัสดีครับคุณ " + name + ",\n\n" +
             "ระบบได้รับผลงานของคุณเรียบร้อยแล้ว\n" +
             "ลิงก์ผลงานที่ส่งมา: " + workLink + "\n\n" +
             "***ขอบคุณที่ตั้งใจเรียนรู้และร่วมทำ Workshop ในหลักสูตรนี้ครับ***\n\n" +
             "หลักสูตร: การวิเคราะห์ข้อมูลด้วยโปรแกรม Power BI\n" +
             "สถานที่: ณ สถาบันพัฒนาฝีมือแรงงาน 3 ชลบุรี\n\n" +
             "ขอบคุณครับ\n" +
             "coach.sarm@gmail.com";
  
  GmailApp.sendEmail(email, subject, body, {
    name: "Power BI Workshop"
  });
}
