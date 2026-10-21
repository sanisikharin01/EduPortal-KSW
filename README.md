# EduPortal-KSW
ระบบจัดการเรียนการสอนออนไลน์สำหรับโรงเรียน (LMS)
# 🎓 EduPortal LMS — ระบบจัดการเรียนการสอนออนไลน์สำหรับโรงเรียน

**EduPortal** คือระบบบริหารจัดการการเรียนการสอนออนไลน์ (Learning Management System - LMS) ที่สมบูรณ์แบบ ออกแบบตามบริบทจริงของโรงเรียนไทย **ฟรีค่าเซิร์ฟเวอร์และค่าฐานข้อมูล 100% ตลอดชีพ** ด้วยการผสานพลังของ **Frontend (React 18 + Tailwind CSS + Lucide Icons + SweetAlert2)** และ **Backend Serverless (Google Apps Script + Google Sheets Database + Google Drive Storage)** พร้อมรันบน **GitHub Pages** ได้ทันทีโดยไม่ต้องตั้งค่า Build Server

---

## ✨ จุดเด่นและฟีเจอร์สำคัญ (Key Features)

### 1. บทบาทผู้ใช้งานที่ออกแบบตามบริบทจริงของโรงเรียน (3 Roles)
* **👨‍🎓 นักเรียน (Student):**
  * เข้าสู่ระบบด้วย **"รหัสนักเรียน" (StudentID)** และรหัสผ่าน/PIN (4 หลัก)
  * ไม่บังคับกรอกอีเมล (Email Optional) เพื่อลดความยุ่งยากของนักเรียนระดับประถม/มัธยม
  * เข้าถึงเฉพาะรายวิชาที่ตนเองมีสิทธิ์ (`AllowedCourses`)
* **👩‍🏫 ครูผู้สอน (Teacher):**
  * เข้าสู่ระบบด้วยอีเมลโรงเรียนและรหัสผ่าน
  * จัดการรายวิชา, เพิ่ม/แก้ไขบทเรียนและสื่อการสอน (วิดีโอ YouTube / Google Drive Stream, เอกสาร PDF)
  * มอบหมายการบ้าน, ตรวจงานนักเรียนพร้อมให้คะแนนและคำติชม (Feedback)
  * สร้างชุดข้อสอบปรนัย พร้อมดูรายงานคะแนนการสอบของนักเรียน
  * ดูรายงานสรุปผลการประเมินการสอนประจำวิชา (คะแนนเฉลี่ย 5 ด้าน และคำติชมแบบไม่ระบุตัวตน)
* **🛡️ ผู้ดูแลระบบ (System Admin):**
  * เข้าสู่ระบบด้วยรหัสผ่านผู้ดูแลระบบ
  * แถบควบคุม Backend (Google Apps Script Database Control Panel) มองเห็นและใช้งานได้เฉพาะ Admin เท่านั้น
  * จัดการข้อมูลครู, นักเรียน, รายวิชา และกำหนดสิทธิ์การเข้าถึงรายวิชา
  * **ระบบนำเข้าข้อมูลนักเรียนจำนวนมากผ่าน CSV (High-Performance Chunking):** นำเข้านักเรียนหลายร้อย/หลายพันคนได้พร้อมกัน โดยระบบแบ่งส่งเป็นชุด (Batching) ป้องกันหน้าเว็บค้างและไม่ติด Limit การรันของ GAS
  * จัดการประกาศป๊อปอัปโรงเรียน (เปิด/ปิด และแก้ไขเนื้อหา)

---

### 2. โมดูลหลักของระบบ LMS (Core LMS Modules)
1. **📖 บทเรียนและสื่อการเรียนรู้ (Lessons & Materials + Rich Lesson Studio):**
   * **เครื่องมือเขียนและจัดหน้าบทเรียนระดับโปร (`Rich Lesson Studio`):**
     * **จัดการฟอนต์ (Font Family & Typography):** เลือกฟอนต์ภาษาไทย/อังกฤษได้ 6 รูปแบบ (`Sarabun`, `Prompt`, `Kanit`, `Chakra Petch`, `Mali`, และ `JetBrains Mono` สำหรับโค้ด) พร้อมปรับขนาดตัวอักษรและระดับหัวข้อ (`H1`, `H2`, `H3`, `Quote`)
     * **จัดรูปแบบและตำแหน่งข้อความ:** ตัวหนา, ตัวเอียง, ขีดเส้นใต้, ถาดสีตัวอักษร, สีไฮไลต์พื้นหลัง, จัดชิดซ้าย/กึ่งกลาง/ชิดขวา/เต็มบรรทัด, รายการแบบจุด/ตัวเลข, ตารางเปรียบเทียบ และกล่องเน้นสาระสำคัญ (`Callout Box`)
     * **แทรกรูปภาพด้วย URL (`Image URL`):** วางลิงก์รูปภาพ กำหนดคำบรรยายใต้ภาพ (`Caption`) และเลือกความกว้าง (`50%`, `75%`, `100%`)
     * **แทรกกล่องโค้ด (`Code Block`):** รองรับ `Python`, `HTML/CSS`, `JavaScript`, `C/C++`, `SQL`, `Pseudocode` แสดงผลในกล่อง Dark Theme อ่านง่าย
     * **รองรับ Inline Frame (`<iframe>` Embeds):** วางลิงก์สื่อการสอนหรือโค้ด `<iframe ...>` เพื่อฝังสไลด์ **Canva**, **Wordwall**, **GeoGebra**, **PhET Simulation**, **Google Slides**, **YouTube**, หรือ **Google Drive** ลงในเนื้อหาบทเรียนได้โดยตรง พร้อมโหมดสลับมุมมอง (`🎨 Visual`, `</> HTML`, `👁️ มุมมองนักเรียน`)
   * รองรับการสตรีมวิดีโอจาก YouTube และ Google Drive พร้อมโปรแกรมเล่นวิดีโอในตัว และแนบลิงก์เอกสารประกอบการสอน
   * ระบบจัดลำดับเนื้อหา (`Order`) และสลับการแสดงผล (`Publish` / `Unpublish`)
2. **🤖 ระบบ AI ผู้ช่วยครูอัตโนมัติ (AI Lesson & Exam Generator + Multi-Model AI Hub):**
   * **AI สร้างบทเรียนและสื่อการสอนอัตโนมัติ (`AiLessonGeneratorModal`):**
     * เพียงระบุหัวข้อเรื่อง เลือกจำนวนบทเรียน (`1`, `3`, หรือ `5` บทเรียนต่อเนื่อง) และรูปแบบการจัดการเรียนรู้ (`เข้าใจง่าย`, `Active Learning`, `สรุปเข้มเตรียมสอบ`, `Project-Based`)
     * AI จะออกแบบชื่อบทเรียน จุดประสงค์การเรียนรู้ เนื้อหาหลัก กิจกรรมท้ายบท พร้อมคัดกรองลิงก์สื่อการสอนและวิดีโอให้อัตโนมัติ (หรือกดปุ่ม `✨ ให้ AI ช่วยเขียนเนื้อหา` ในหน้าเพิ่มบทเรียนเดี่ยวได้ในคลิกเดียว)
   * **AI ช่วยออกข้อสอบรายข้อ & สร้างชุดข้อสอบอัตโนมัติ (`ExamBuilderModal`):**
     * **ออกโจทย์เจาะจง "แต่ละข้อ" (`Per-Question AI Assist`):** ในการ์ดข้อสอบทุกข้อ ครูสามารถระบุประเด็นย่อย เลือกระดับความยาก (`ง่าย`, `ปานกลาง`, `ยาก`) แล้วกด **`✨ ให้ AI คิดโจทย์ข้อนี้`** เพื่อให้ AI คิดโจทย์ ตัวเลือก 4 ข้อ (`ก`, `ข`, `ค`, `ง`) กาข้อเฉลยที่ถูกต้อง และเขียนคำอธิบายเฉลยให้ทันที
     * **สร้างข้อสอบรวดเดียวหลายข้อ (`Bulk AI Exam Generator`):** สั่งให้ AI สร้างข้อสอบเพิ่มทีละ `1`, `3`, `5`, หรือ `10` ข้อเข้าชุดข้อสอบได้ทันที โดยกระจายตำแหน่งข้อเฉลยอย่างสมดุล
   * **ตั้งค่าและเลือกสลับโมเดล AI ได้อิสระ ทั้งฟรีและมีค่าใช้จ่าย (`AiSettingsView`):**
     * **🟢 โมเดล AI ฟรี (Free Models):**
       1. `EduPortal Smart Curriculum & Exam AI` (เอนจินภาษาไทยในตัว • **ฟรี 100% ไม่ต้องใช้ API Key**)
       2. `GPT-4o-mini Cloud AI (Pollinations)` (Cloud AI ออนไลน์ • **ฟรี 100% ไม่ต้องใช้ API Key**)
       3. `Google Gemini 2.0 Flash` (ฟรีด้วย Free Tier API Key จาก Google AI Studio)
       4. `Meta Llama 3.3 70B Versatile` (ฟรีความเร็วสูงด้วย Free API Key จาก GroqCloud)
       5. `DeepSeek R1 / Gemma 3 (OpenRouter Free)` (ฟรีผ่านโมเดลตระกูล `:free` บน OpenRouter)
     * **🟣 โมเดล AI ระดับโปร / มีค่าใช้จ่าย (Paid / Pro Models):**
       6. `Google Gemini 2.5 Pro (Thinking)`
       7. `OpenAI GPT-4o (Omni Flagship)`
       8. `OpenAI GPT-4o mini`
       9. `Anthropic Claude 3.7 Sonnet`
       10. `DeepSeek V3 (Official API)`
       11. `OpenRouter Custom Model` (ระบุรหัสโมเดลได้อิสระกว่า 200+ โมเดล)
     * มาพร้อมระบบ **Smart Free Fallback** (สลับใช้ AI ฟรีในตัวอัตโนมัติเมื่อโมเดลเสียเงินโควต้าหมดหรือยังไม่ได้ใส่ Key) และปุ่ม **⚡ ทดสอบโมเดล AI**
3. **📝 การบ้านและส่งไฟล์เข้า Google Drive (Assignments & Submissions):**
   * นักเรียนแนบไฟล์ภาพหรือเอกสาร -> ระบบแปลงไฟล์เป็น Base64 ส่งผ่าน API เข้า Google Drive โฟลเดอร์ของโรงเรียนอัตโนมัติ
   * กำหนดสิทธิ์ไฟล์เป็น `ANYONE_WITH_LINK` และ `VIEW` ให้ครูเปิดตรวจได้ทันทีโดยไม่ติด Permission Error
   * ครูตรวจงาน ให้คะแนน และพิมพ์คำแนะนำส่งกลับหานักเรียนได้แบบ Real-time
4. **⏱️ แบบทดสอบออนไลน์ (Online Examination System):**
   * ครูสร้างข้อสอบ 4 ตัวเลือก พร้อมกำหนดเวลาทำข้อสอบ (นาที)
   * นักเรียนทำข้อสอบพร้อมระบบจับเวลาถอยหลัง (Countdown Timer) และ**ส่งกระดาษคำตอบอัตโนมัติทันทีเมื่อหมดเวลา**
   * ระบบตรวจข้อสอบอัตโนมัติและแสดงผลคะแนนทันทีหลังทำเสร็จ พร้อมบันทึกประวัติลงฐานข้อมูล
5. **⭐ แบบประเมินครูผู้สอน (Teacher Evaluation):**
   * นักเรียนประเมินความพึงพอใจ 5 ด้าน (ความชัดเจน, กิจกรรม, สื่อการสอน, การวัดผล, การให้คำปรึกษา) พร้อมข้อเสนอแนะ
   * **ประเมินแบบไม่ระบุตัวตน (Anonymous):** ระบบบันทึก `StudentID` ลงตารางชีตเพื่อป้องกันการประเมินซ้ำ แต่จะปิดบังตัวตนไม่ส่งชื่อ/รหัสนักเรียนไปแสดงในหน้าแดชบอร์ดสรุปของครู
6. **🔔 ประกาศและแจ้งเตือนป๊อปอัป (Popup Announcement):**
   * แสดงป๊อปอัปแจ้งเตือนข่าวสารสำคัญเมื่อเข้าสู่ระบบครั้งแรกในแต่ละเซสชัน
   * ผู้ดูแลระบบสามารถปรับแต่งและเปิด/ปิดได้จากเมนูการตั้งค่า
7. **📱 รองรับการใช้งานบนมือถือเต็มรูปแบบ (Mobile-First Ergonomic UI):**
   * **แถบเมนูด้านล่าง (`MobileBottomNav`):** สลับหน้าและสลับโมดูลในรายวิชา (`บทเรียน`, `การบ้าน`, `ข้อสอบ`, `ประเมินครู`) ด้วยนิ้วโป้งมือเดียวพร้อมตัวเลขแจ้งเตือน (`Badge`)
   * **การ์ดข้อมูลสำหรับมือถือ & Bottom-Sheet Modals:** แสดงรายชื่อนักเรียนและครูเป็นการ์ดอ่านง่ายบนจอมือถือ พร้อมแถบนำทางข้อสอบแบบ Sticky ด้านล่างระหว่างทำข้อสอบ

---

## 🗄️ โครงสร้างฐานข้อมูล Google Sheets (10 Schemas)

สคริปต์ `Code.gs` มาพร้อมฟังก์ชัน `setupDatabase()` ที่จะสร้างชีตทั้ง 10 ตารางให้โดยอัตโนมัติ:

1. `Students`: ID, StudentID, PIN, Name, Email, Grade, AllowedCourses, CreatedAt
2. `Teachers`: TeacherID, Name, Email, Password, Department, CreatedAt
3. `Courses`: CourseID, Code, Name, TeacherID, TeacherName, GradeLevel, Term, Credits, CoverColor, CreatedAt
4. `Lessons`: LessonID, CourseID, Title, Description, VideoURL, AttachmentsJSON, Order, Published, CreatedAt
5. `Assignments`: AssignmentID, CourseID, Title, Description, MaxScore, DueDate, AttachmentsJSON, CreatedAt
6. `Submissions`: ID, AssignmentID, CourseID, StudentID, StudentName, Grade, FileName, FileUrl, DriveFileID, Note, SubmittedAt, Score, Feedback, Status
7. `Exams`: ExamID, CourseID, Title, Description, TimeLimitMin, QuestionsJSON, Published, CreatedAt
8. `ExamAttempts`: AttemptID, ExamID, CourseID, StudentID, StudentName, Score, TotalScore, SubmittedAt, TimeSpentSec
9. `Evaluations`: ID, CourseID, TeacherID, TeacherName, StudentID, Clarity, Engagement, Materials, Assessment, Counseling, OverallScore, Comment, SubmittedAt
10. `Settings`: SettingKey, SettingValueJSON, UpdatedAt

---

## 🚀 ขั้นตอนการติดตั้งและการใช้งานจริง (Step-by-Step Setup)

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล Google Sheets และ Google Apps Script
1. เข้าไปที่ [Google Sheets](https://sheets.google.com) แล้วสร้างสเปรดชีตเปล่าขึ้นมา 1 ไฟล์ (ตั้งชื่อ เช่น `EduPortal_Database`)
2. ที่เมนูด้านบน ไปที่ **ส่วนขยาย (Extensions)** -> **Apps Script**
3. ลบโค้ดเดิมในโปรเจกต์ออก แล้วคัดลอกโค้ดทั้งหมดจากไฟล์ `Code.gs` ในโฟลเดอร์นี้ไปวางแทนที่
4. กดบันทึก (Ctrl + S)
5. ที่ดรอปดาวน์ฟังก์ชันด้านบน เลือกฟังก์ชัน `setupDatabase` แล้วกดปุ่ม **เรียกใช้ (Run)**
   * *Google จะขออนุญาตเข้าถึงสิทธิ์ ให้กด "ตรวจสอบสิทธิ์" -> เลือกบัญชี Google ของท่าน -> กด "ขั้นสูง (Advanced)" -> กด "ไปที่โปรเจกต์ (ไม่ปลอดภัย)" -> กด "อนุญาต (Allow)"*
6. กลับไปดูที่ Google Sheets จะพบว่าระบบสร้างชีตทั้ง 10 ตารางพร้อมจัดสีหัวตารางให้เรียบร้อยแล้ว

### ขั้นตอนที่ 2: เผยแพร่ Apps Script เป็น Web App (Deploy)
1. ในหน้า Apps Script ให้คลิกปุ่มสีน้ำเงิน **การทำให้ใช้งานได้ (Deploy)** -> **การทำให้ใช้งานได้ใหม่ (New deployment)**
2. คลิกไอคอนฟันเฟือง ⚙️ ด้านซ้าย เลือกประเภท **เว็บแอป (Web app)**
3. ตั้งค่าดังนี้:
   * **คำอธิบาย (Description):** `EduPortal LMS API v2.0`
   * **เรียกใช้ในฐานะ (Execute as):** `ฉัน (Me - your email)` *(สำคัญมาก)*
   * **ผู้มีสิทธิ์เข้าถึง (Who has access):** `ทุกคน (Anyone)` *(สำคัญมาก เพื่อให้ GitHub Pages ยิงเชื่อมต่อได้โดยไม่ติดสิทธิ์)*
4. กดปุ่ม **ทำให้ใช้งานได้ (Deploy)**
5. คัดลอก **URL เว็บแอป (Web App URL)** ที่ลงท้ายด้วย `/exec` เก็บไว้

### ขั้นตอนที่ 3: เปิดใช้งาน EduPortal และเชื่อมต่อ URL
1. เปิดไฟล์ `index.html` บนเบราว์เซอร์ (สามารถดับเบิลคลิกเปิดตรงๆ หรือรันผ่าน Live Server ได้ทันที)
2. เข้าสู่ระบบด้วยบทบาท **ผู้ดูแลระบบ (Admin)**
   * **รหัสผ่าน Admin:** `admin1234`
3. ที่แถบสีดำด้านบนสุด **"แผงควบคุมฐานข้อมูล (Admin Backend)"** คลิกปุ่ม **"ตั้งค่า Web App URL"**
4. วาง URL เว็บแอปที่คัดลอกมาจากขั้นตอนที่ 2 แล้วกด **"บันทึก URL"**
5. คลิกปุ่ม **"ทดสอบเชื่อมต่อ (Ping)"** ระบบจะแจ้งเตือนว่าเชื่อมต่อสำเร็จ
6. คลิกปุ่ม **"ส่งข้อมูล (Push)"** เพื่อส่งข้อมูลเริ่มต้นขึ้นสู่ Google Sheets เป็นอันเสร็จสิ้น 100%!

---

## 🌐 การนำขึ้น GitHub Pages (รันออนไลน์ฟรีตลอดชีพ)

1. สร้าง GitHub Repository ใหม่ (เช่น `eduportal-lms`)
2. อัปโหลดไฟล์ `index.html` ไปไว้ที่ Root Directory ของ Repository
3. ไปที่แท็บ **Settings** ของ Repository -> เลือกเมนู **Pages** ด้านซ้าย
4. ในส่วน **Build and deployment**:
   * **Source:** `Deploy from a branch`
   * **Branch:** `main` (หรือ `master`) / โฟลเดอร์ `/(root)`
5. กดปุ่ม **Save**
6. รอประมาณ 1-2 นาที GitHub จะสร้าง URL สำหรับเข้าใช้งาน เช่น `https://username.github.io/eduportal-lms/`
7. สามารถแชร์ลิงก์นี้ให้นักเรียนและคุณครูเปิดใช้งานได้จากมือถือ แท็บเล็ต หรือคอมพิวเตอร์ได้ทันที!

---

## 🔑 บัญชีทดสอบระบบที่ตั้งค่าไว้ล่วงหน้า (Demo Accounts)

| บทบาท (Role) | บัญชี / ข้อมูลล็อกอิน | รหัสผ่าน / PIN | หมายเหตุ |
| :--- | :--- | :--- | :--- |
| **นักเรียน (Student)** | รหัส: `04501` (กิตติพงษ์) | `1234` | มีสิทธิ์วิชา ว23101, ค23101 |
| **นักเรียน (Student)** | รหัส: `04502` (ธนพร) | `1234` | มีสิทธิ์วิชา ว23101 |
| **ครูผู้สอน (Teacher)** | อีเมล: `somsak@school.ac.th` | `123` | ครูสมศักดิ์ (กลุ่มสาระวิทย์-คอม) |
| **ครูผู้สอน (Teacher)** | อีเมล: `porntip@school.ac.th` | `123` | ครูพรทิพย์ (กลุ่มสาระคณิตศาสตร์) |
| **ผู้ดูแลระบบ (Admin)** | เลือกรุ่น Admin | `admin1234` | เข้าถึงศูนย์ควบคุมทุกฟังก์ชัน |

---

## 🔒 กฎทางเทคนิคสำคัญเพื่อความเสถียร (Strict Technical Architecture)

1. **การอ่านข้อมูลด้วย `getDisplayValues()`:** ป้องกันปัญหารหัสนักเรียนที่มีเลข 0 นำหน้า (เช่น `04501`) ถูกแปลงเป็นตัวเลขแล้วเลขศูนย์หาย และป้องกันฟอร์แมตวันที่คลาดเคลื่อน
2. **CORS Bypass สำหรับ GitHub Pages:** การส่ง Request จากเบราว์เซอร์ไปยัง Google Apps Script ใช้ `Content-Type: text/plain;charset=utf-8` และส่งข้อมูลผ่าน `JSON.stringify(payload)` เสมอ ทำให้ไม่ติดปัญหา CORS Preflight OPTIONS บน GitHub Pages
3. **ป้องกันข้อมูลชนกันด้วย `LockService`:** ในฟังก์ชัน `doPost(e)` มีการเรียกใช้ `LockService.getScriptLock()` พร้อมตั้งเวลารอสูงสุด 30-35 วินาที เพื่อป้องกันข้อผิดพลาดเวลาที่นักเรียนส่งงานหรือส่งข้อสอบพร้อมกันทั้งห้องเรียน
4. **การอัปโหลดไฟล์ตรงเข้า Google Drive:** รองรับการแปลงไฟล์เป็น Base64 แล้วสร้างไฟล์ใน Google Drive โดยตรง พร้อมคืนค่า URL ที่แชร์แบบเปิดดูได้ทันที
5. **High-Performance Chunking:** ระบบนำเข้า CSV ทำการตัดแบ่งข้อมูลนักเรียนเป็น Batch ชุดละ 50 คน ส่งขึ้น API ต่อเนื่องพร้อมแสดงแถบความคืบหน้า (Progress Bar) ทำให้นำเข้าข้อมูลนักเรียนหลักพันคนได้โดยไม่ติด Timeout 6 นาทีของ Google Apps Script
