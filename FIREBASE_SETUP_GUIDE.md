# คู่มือการตั้งค่า Firebase Realtime Database + Google Drive สำหรับ EduPortal LMS

เอกสารฉบับนี้แนะนำขั้นตอนการสร้างและตั้งค่า Firebase Realtime Database เพื่อใช้งานร่วมกับ Google Drive ใน EduPortal LMS เวอร์ชัน Realtime

---

## สรุปภาพรวมสถาปัตยกรรม (System Overview)

- **ฐานข้อมูลหลัก**: ใช้ **Firebase Realtime Database** จัดการข้อมูลนักเรียน, ครู, รายวิชา, บทเรียน, การบ้าน, คะแนนสอบ และแบบประเมิน โดยมีการซิงค์ข้อมูลสด (Realtime Listener)
- **คลังไฟล์และรูปภาพ**: ใช้ **Google Drive** ผ่าน Google Apps Script (`Code.gs`) รับไฟล์งาน/การบ้าน แปลงและบันทึกไฟล์ลง Drive Folder ID จากนั้นส่ง URL และ File ID กลับมาบันทึกลง Firebase

---

## ขั้นตอนที่ 1: สร้างโปรเจกต์ใน Firebase Console

1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/) แล้วล็อกอินด้วยบัญชี Google
2. คลิกปุ่ม **"เพิ่มโครงการ" (Add project)** หรือ **"สร้างโปรเจกต์"**
3. ตั้งชื่อโปรเจกต์ เช่น `eduportal-lms` แล้วกด **ดำเนินการต่อ (Continue)**
4. Google Analytics: เลือกปิดไว้ก่อนได้ (หรือเปิดตามต้องการ) แล้วกด **สร้างโครงการ (Create project)**

---

## ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database

1. ในแถบเมนูด้านซ้าย เลือก **สร้าง (Build)** -> **Realtime Database**
2. คลิกปุ่ม **"สร้างฐานข้อมูล" (Create Database)**
3. **เลือกตำแหน่งที่ตั้งฐานข้อมูล (Location)**: แนะนำเลือก `Singapore (asia-southeast1)` เพื่อความเร็วสูงสุดในไทย
4. **กฎความปลอดภัย (Security Rules)**:
   - เลือก **เริ่มในโหมดทดสอบ (Start in test mode)** ชั่วคราว หรือ
   - เลือกโหมดใดก็ได้ แล้วไปที่แท็บ **กฎ (Rules)** เพื่อนำกฎด้านล่างนี้ไปวาง

---

## ขั้นตอนที่ 3: ตั้งค่ากฎความปลอดภัย (Security Rules)

ไปที่แท็บ **Rules** ในหน้า Realtime Database แล้วคัดลอกข้อความด้านล่างนี้ไปวางแทนที่:

```json
{
  "rules": {
    "eduportal": {
      ".read": true,
      ".write": true,
      "Students": {
        ".indexOn": ["StudentID", "PIN"]
      },
      "Courses": {
        ".indexOn": ["CourseID", "TeacherID", "GradeLevel"]
      },
      "Assignments": {
        ".indexOn": ["AssignmentID", "CourseID", "DueDate"]
      },
      "Submissions": {
        ".indexOn": ["SubmissionID", "AssignmentID", "CourseID", "StudentID", "Status"]
      },
      "Lessons": {
        ".indexOn": ["LessonID", "CourseID", "Order"]
      },
      "Exams": {
        ".indexOn": ["ExamID", "CourseID"]
      },
      "ExamAttempts": {
        ".indexOn": ["AttemptID", "ExamID", "StudentID"]
      }
    }
  }
}
```
*จากนั้นกดปุ่ม **เผยแพร่ (Publish)***

---

## ขั้นตอนที่ 4: คัดลอกค่า Firebase Config

1. คลิกที่ไอคอน **ฟันเฟือง (Project Settings)** ที่มุมซ้ายบน ถัดจากชื่อโปรเจกต์
2. เลื่อนลงมาที่หัวข้อ **"แอปของคุณ" (Your apps)**
3. คลิกไอคอนเว็บ `</>` (Web App)
4. ตั้งชื่อแอป เช่น `EduPortal Web` แล้วกด **ลงทะเบียนแอป (Register app)**
5. คุณจะได้รับชุดโค้ด `firebaseConfig` หน้าตาแบบนี้:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "eduportal-lms.firebaseapp.com",
  databaseURL: "https://eduportal-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eduportal-lms",
  storageBucket: "eduportal-lms.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## ขั้นตอนที่ 5: ตั้งค่า Google Drive Folder ID ใน Google Apps Script

1. เปิด [Google Drive](https://drive.google.com/) แล้วสร้างโฟลเดอร์สำหรับเก็บไฟล์งาน เช่น `EduPortal_Uploads`
2. คลิกขวาที่โฟลเดอร์ -> เลือก **แชร์ (Share)** -> กำหนดให้ **"ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" (Anyone with the link - Viewer)**
3. คัดลอก **Folder ID** จากแถบ URL:
   `https://drive.google.com/drive/folders/`**`1AbCdEfGhIjKlMnOpQrStUvWxYz`**
4. นำ **Web App URL** ของ Google Apps Script (`Code.gs`) ที่ Deploy แบบ Anyone เรียบร้อยแล้วมาใช้เป็น File Gateway

---

## ขั้นตอนที่ 6: การเชื่อมต่อผ่าน `firebase-service.js`

ในโปรเจกต์มีไฟล์ [`firebase-service.js`](file:///c:/Users/GIGABYTE/OneDrive/เดสก์ท็อป/001 โปรแกรม/web site/EduPortal-LMS/firebase-service.js) เตรียมไว้ให้แล้ว สามารถเรียกใช้งานได้ทันที:

```javascript
// 1. กำหนดค่า Config
window.FirebaseLMS.saveConfig({
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "eduportal-lms.firebaseapp.com",
  databaseURL: "https://eduportal-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eduportal-lms",
  storageBucket: "eduportal-lms.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}, "https://script.google.com/macros/s/YOUR_GAS_ID/exec", "YOUR_DRIVE_FOLDER_ID");

// 2. ฟังข้อมูลแบบ Realtime
window.FirebaseLMS.subscribeToTable('Submissions', (submissions) => {
  console.log('ข้อมูลการส่งการบ้านอัปเดตแบบ Realtime:', submissions);
});

// 3. อัปโหลดไฟล์ไป Google Drive แล้วเซฟข้อมูลลง Firebase
async function handleSubmitAssignment(file, submissionData) {
  // ก. อัปโหลดไฟล์ไป Drive
  const driveResult = await window.FirebaseLMS.uploadFileToDrive(file);
  // ได้ driveResult = { fileUrl, driveFileId, fileName }

  // ข. แนบข้อมูลไฟล์แล้วเซฟลง Firebase RTDB
  submissionData.FileUrl = driveResult.fileUrl;
  submissionData.DriveFileID = driveResult.driveFileId;
  submissionData.FileName = driveResult.fileName;

  await window.FirebaseLMS.saveRecord('Submissions', submissionData.ID, submissionData);
  alert('ส่งงานและบันทึกข้อมูลเรียบร้อย!');
}
```
