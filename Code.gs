/**
 * Google Apps Script for Power BI Pre-test Form
 * Handles form submissions and appends data to Google Sheets.
 */

function doPost(e) {
  var sheetName = "แบบทดสอบก่อนเรียน";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Set Headers if sheet is new
    var headers = [
      "Timestamp", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "อายุ", 
      "ระดับการศึกษา", "ตำแหน่งงานปัจจุบัน", "หัวข้อที่สนใจ 1-5", 
      "คะแนน Pre-test", "ข้อ 1", "ข้อ 2", "ข้อ 3", "ข้อ 4", "ข้อ 5"
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
      data.age,
      data.education,
      data.job,
      data.interests,
      data.score,
      data.q1,
      data.q2,
      data.q3,
      data.q4,
      data.q5
    ];
    
    sheet.appendRow(row);

    // Send Email Notification
    if (data.email) {
      sendScoreEmail(data.email, data.name, data.score);
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

function sendScoreEmail(email, name, score) {
  var subject = "ผลคะแนนแบบทดสอบก่อนเรียน Power BI - " + name;
  var body = "สวัสดีครับคุณ " + name + ",\n\n" +
             "คุณได้ทำแบบทดสอบก่อนเรียน Power BI เรียบร้อยแล้ว\n" +
             "คะแนนที่คุณได้คือ: " + score + " / 5 คะแนน\n\n" +
             "***ขอความอนุเคราะห์ผู้เข้ารับการฝึกอบรมเข้าร่วมตามวัน – เวลา ที่ระบุในประกาศรับสมัคร***\n\n" +
             "ขอบคุณครับ\n" +
             "coach.sarm@gmail.com";
  
  GmailApp.sendEmail(email, subject, body, {
    name: "Power BI Workshop"
  });
}
