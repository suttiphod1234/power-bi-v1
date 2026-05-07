/**
 * Google Apps Script for Power BI T4 Quiz
 * Sheet Destination: https://docs.google.com/spreadsheets/d/1gEgRRu3ZkikLoyFPK1oh1eKXGx4iNGoHJmOcuZc91ek/
 * Tab: T4
 */

function doPost(e) {
  var sheetName = "T4";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Set Headers for T4 Quiz (25 Questions)
    var headers = [
      "Timestamp", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "ตำแหน่งงานปัจจุบัน", 
      "คะแนน T4 (เต็ม 25)", 
      "ข้อ 1", "ข้อ 2", "ข้อ 3", "ข้อ 4", "ข้อ 5", 
      "ข้อ 6", "ข้อ 7", "ข้อ 8", "ข้อ 9", "ข้อ 10",
      "ข้อ 11", "ข้อ 12", "ข้อ 13", "ข้อ 14", "ข้อ 15",
      "ข้อ 16", "ข้อ 17", "ข้อ 18", "ข้อ 19", "ข้อ 20",
      "ข้อ 21", "ข้อ 22", "ข้อ 23", "ข้อ 24", "ข้อ 25"
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
      data.score,
      data.q1, data.q2, data.q3, data.q4, data.q5,
      data.q6, data.q7, data.q8, data.q9, data.q10,
      data.q11, data.q12, data.q13, data.q14, data.q15,
      data.q16, data.q17, data.q18, data.q19, data.q20,
      data.q21, data.q22, data.q23, data.q24, data.q25
    ];
    
    sheet.appendRow(row);

    // Send Email Notification
    if (data.email) {
      sendScoreEmailT4(data.email, data.name, data.score);
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

function sendScoreEmailT4(email, name, score) {
  var subject = "ผลคะแนนแบบทดสอบ T4 - " + name;
  var body = "สวัสดีครับคุณ " + name + ",\n\n" +
             "คุณได้ทำแบบทดสอบ Power BI พื้นฐาน (T4) เรียบร้อยแล้ว\n" +
             "คะแนนที่คุณได้คือ: " + score + " / 25 คะแนน\n\n" +
             "***ขอบคุณที่ตั้งใจเรียนรู้และร่วมสนุกในหลักสูตรนี้ครับ***\n\n" +
             "หลักสูตร: การวิเคราะห์ข้อมูลด้วยโปรแกรม Power BI\n" +
             "สถานที่: ณ สถาบันพัฒนาฝีมือแรงงาน 3 ชลบุรี\n\n" +
             "ขอบคุณครับ\n" +
             "coach.sarm@gmail.com";
  
  GmailApp.sendEmail(email, subject, body, {
    name: "Power BI Workshop T4"
  });
}
