/**
 * Google Apps Script for Power BI T1 Quiz
 * Sheet Destination: https://docs.google.com/spreadsheets/d/1gEgRRu3ZkikLoyFPK1oh1eKXGx4iNGoHJmOcuZc91ek/
 * Tab: T1
 */

function doPost(e) {
  var sheetName = "T1";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Set Headers for T1 Quiz (10 Questions)
    var headers = [
      "Timestamp", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "ตำแหน่งงานปัจจุบัน", 
      "คะแนน T1 (เต็ม 10)", "ข้อ 1", "ข้อ 2", "ข้อ 3", "ข้อ 4", "ข้อ 5", 
      "ข้อ 6", "ข้อ 7", "ข้อ 8", "ข้อ 9", "ข้อ 10"
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
      data.q1,
      data.q2,
      data.q3,
      data.q4,
      data.q5,
      data.q6,
      data.q7,
      data.q8,
      data.q9,
      data.q10
    ];
    
    sheet.appendRow(row);

    // Send Email Notification
    if (data.email) {
      sendScoreEmailT1(data.email, data.name, data.score);
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

function sendScoreEmailT1(email, name, score) {
  var subject = "ผลคะแนนแบบทดสอบ T1 - " + name;
  var body = "สวัสดีครับคุณ " + name + ",\n\n" +
             "คุณได้ทำแบบทดสอบความรู้พื้นฐาน Power BI Desktop (T1) เรียบร้อยแล้ว\n" +
             "คะแนนที่คุณได้คือ: " + score + " / 10 คะแนน\n\n" +
             "***ขอความอนุเคราะห์ผู้เข้ารับการฝึกอบรมเข้าร่วมตามวัน – เวลา ที่ระบุในประกาศรับสมัคร***\n\n" +
             "หลักสูตร: การวิเคราะห์ข้อมูลด้วยโปรแกรม Power BI\n" +
             "สถานที่: ณ สถาบันพัฒนาฝีมือแรงงาน 3 ชลบุรี\n\n" +
             "ขอบคุณครับ\n" +
             "coach.sarm@gmail.com";
  
  GmailApp.sendEmail(email, subject, body, {
    name: "Power BI Workshop T1"
  });
}
