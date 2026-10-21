/**
 * =========================================================================
 * EduPortal LMS - Firebase Realtime Database & Google Drive Bridge Service
 * Version: 3.0.0 (Realtime Edition)
 * =========================================================================
 * 
 * โมดูลนี้ทำหน้าที่:
 * 1. เชื่อมต่อ Firebase Realtime Database (RTDB) แบบ Realtime Sync
 * 2. จัดการ CRUD ข้อมูลโรงเรียน (Students, Teachers, Courses, Assignments, ฯลฯ)
 * 3. ส่งไฟล์ไปยัง Google Apps Script Gateway เพื่อฝากไฟล์ลง Google Drive ID
 */

// โครงสร้าง Config เริ่มต้นของ EduPortal LMS
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBpxLrxZCHFJF9oF7NLZPyJ97FepNpgcKs",
  authDomain: "eduportal-eaf18.firebaseapp.com",
  databaseURL: "https://eduportal-eaf18-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eduportal-eaf18",
  storageBucket: "eduportal-eaf18.firebasestorage.app",
  messagingSenderId: "872982218216",
  appId: "1:872982218216:web:ab314897ce0fcf1854d05d",
  measurementId: "G-PJRZZ6STC5"
};

class FirebaseLmsService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isInitialized = false;
    this.listeners = {};
    this.config = this.loadConfig();
    this.gasDriveGatewayUrl = localStorage.getItem('eduportal_gas_drive_url') || '';
    this.driveFolderId = localStorage.getItem('eduportal_drive_folder_id') || '';
  }

  /**
   * โหลดค่า Firebase Config จาก localStorage หรือค่าเริ่มต้น
   */
  loadConfig() {
    try {
      const saved = localStorage.getItem('eduportal_firebase_config');
      return saved ? JSON.parse(saved) : DEFAULT_FIREBASE_CONFIG;
    } catch (e) {
      console.warn('Failed to parse saved firebase config:', e);
      return DEFAULT_FIREBASE_CONFIG;
    }
  }

  /**
   * บันทึกค่า Config ลง localStorage
   */
  saveConfig(newConfig, gasUrl = null, driveFolderId = null) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('eduportal_firebase_config', JSON.stringify(this.config));
    
    if (gasUrl !== null) {
      this.gasDriveGatewayUrl = gasUrl;
      localStorage.setItem('eduportal_gas_drive_url', gasUrl);
    }
    if (driveFolderId !== null) {
      this.driveFolderId = driveFolderId;
      localStorage.setItem('eduportal_drive_folder_id', driveFolderId);
    }

    return this.init();
  }

  /**
   * เริ่มต้นเชื่อมต่อ Firebase App และ Database
   */
  init() {
    if (!this.config || !this.config.databaseURL || !this.config.apiKey) {
      console.warn('[FirebaseLms] Firebase config is incomplete. Running in offline/cache mode.');
      this.isInitialized = false;
      return false;
    }

    try {
      // ตรวจสอบว่ามี Firebase SDK โหลดเข้ามาแล้วหรือไม่
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK is not loaded. Please include Firebase CDN scripts.');
      }

      // ป้องกันการ initialize ซ้ำ
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.app();
      }

      this.db = firebase.database();
      this.isInitialized = true;
      console.log('[FirebaseLms] Connected successfully to:', this.config.databaseURL);
      return true;
    } catch (err) {
      console.error('[FirebaseLms] Initialization failed:', err);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * ฟังการเปลี่ยนแปลงข้อมูลทั้งหมด 10 ตารางแบบ Realtime พร้อมกัน
   * @param {function} callback (formattedTablesObject) => {}
   */
  subscribeAll(callback) {
    if (!this.isInitialized || !this.db) {
      console.warn('[FirebaseLms] Cannot subscribeAll: Firebase not initialized');
      return () => {};
    }

    const ref = this.db.ref('eduportal');
    const tableNames = [
      'Students', 'Teachers', 'Courses', 'Lessons',
      'Assignments', 'Submissions', 'Exams', 'ExamAttempts',
      'Evaluations', 'Settings'
    ];

    const listener = ref.on('value', (snapshot) => {
      if (!snapshot.exists()) {
        callback(null); // ยังไม่มีข้อมูลใน Firebase เลย
        return;
      }
      const rootData = snapshot.val() || {};
      const formattedData = {};

      tableNames.forEach(table => {
        const val = rootData[table];
        if (val) {
          formattedData[table] = Array.isArray(val) ? val.filter(Boolean) : Object.keys(val).map(key => ({
            ...val[key],
            _firebaseKey: key
          }));
        }
      });

      callback(formattedData);
    }, (error) => {
      console.error('[FirebaseLms] Error in subscribeAll:', error);
    });

    return () => ref.off('value', listener);
  }

  /**
   * บันทึกหลายรายการพร้อมกัน (เช่น นำเข้า CSV นักเรียน)
   */
  async batchSaveRecords(table, records, keyField = 'ID') {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firebase is not initialized.');
    }
    const updates = {};
    records.forEach((row, idx) => {
      const rawKey = row[keyField] || `auto_${Date.now()}_${idx}`;
      const safeKey = String(rawKey).replace(/[.#$\[\]\/]/g, '_');
      updates[safeKey] = {
        ...row,
        _updatedAt: firebase.database.ServerValue.TIMESTAMP
      };
    });
    await this.db.ref(`eduportal/${table}`).update(updates);
    return { success: true, count: records.length };
  }

  /**
   * ฟังการเปลี่ยนแปลงข้อมูลแบบ Realtime รายตาราง (Realtime Listener)
   * @param {string} table ชื่อตาราง เช่น 'Courses', 'Assignments', 'Submissions'
   * @param {function} callback ฟังก์ชันที่จะถูกเรียกเมื่อมีข้อมูลใหม่ (data) => {}
   */
  subscribeToTable(table, callback) {
    if (!this.isInitialized || !this.db) {
      console.warn(`[FirebaseLms] Cannot subscribe to ${table}: Firebase not initialized`);
      return () => {};
    }

    const ref = this.db.ref(`eduportal/${table}`);
    
    const listener = ref.on('value', (snapshot) => {
      const val = snapshot.val();
      let records = [];
      if (val) {
        // หากข้อมูลถูกเก็บเป็น Object (Key-Value) ให้แปลงเป็น Array พร้อมเก็บ ID
        records = Array.isArray(val) ? val.filter(Boolean) : Object.keys(val).map(key => ({
          ...val[key],
          _firebaseKey: key
        }));
      }
      callback(records);
    }, (error) => {
      console.error(`[FirebaseLms] Error listening to ${table}:`, error);
    });

    // บันทึกฟังก์ชันยกเลิก Listener
    return () => ref.off('value', listener);
  }

  /**
   * ดึงข้อมูลทั้งหมด 10 ตารางในครั้งเดียว (One-time fetch / Pull All)
   */
  async pullAllData() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firebase is not initialized.');
    }

    const snapshot = await this.db.ref('eduportal').once('value');
    const rootData = snapshot.val() || {};
    const formattedData = {};

    const tableNames = [
      'Students', 'Teachers', 'Courses', 'Lessons',
      'Assignments', 'Submissions', 'Exams', 'ExamAttempts',
      'Evaluations', 'Settings'
    ];

    tableNames.forEach(table => {
      const val = rootData[table];
      if (val) {
        formattedData[table] = Array.isArray(val) ? val.filter(Boolean) : Object.keys(val).map(key => ({
          ...val[key],
          _firebaseKey: key
        }));
      } else {
        formattedData[table] = [];
      }
    });

    return formattedData;
  }

  /**
   * บันทึกหรืออัปเดต Record ข้อมูล 1 รายการ
   * @param {string} table ชื่อตาราง เช่น 'Submissions'
   * @param {string} primaryKey คีย์ระบุเอกลักษณ์ เช่น SubmissionID หรือ StudentID
   * @param {object} recordData ข้อมูลที่ต้องการบันทึก
   */
  async saveRecord(table, primaryKey, recordData) {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firebase is not initialized. Please configure database settings.');
    }

    if (!primaryKey) {
      throw new Error('Primary Key is required to save a record.');
    }

    // ปรับ key ให้ปลอดภัยสำหรับ Firebase path (ห้ามมี . $ # [ ] /)
    const sanitizedKey = String(primaryKey).replace(/[.#$\[\]\/]/g, '_');
    const targetRef = this.db.ref(`eduportal/${table}/${sanitizedKey}`);

    const payload = {
      ...recordData,
      _updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    await targetRef.set(payload);
    return { success: true, key: sanitizedKey };
  }

  /**
   * ลบ Record ออกจากฐานข้อมูล
   */
  async deleteRecord(table, primaryKey) {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firebase is not initialized.');
    }

    const sanitizedKey = String(primaryKey).replace(/[.#$\[\]\/]/g, '_');
    await this.db.ref(`eduportal/${table}/${sanitizedKey}`).remove();
    return { success: true, deletedKey: sanitizedKey };
  }

  /**
   * นำเข้าข้อมูลทั้งหมด (Bulk Upload / Migration จาก Sheet สู่ Firebase)
   */
  async seedDatabase(fullDbObject) {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firebase is not initialized.');
    }

    const rootPayload = {};
    const primaryKeyMap = {
      Students: 'StudentID',
      Teachers: 'TeacherID',
      Courses: 'CourseID',
      Lessons: 'LessonID',
      Assignments: 'AssignmentID',
      Submissions: 'ID',
      Exams: 'ExamID',
      ExamAttempts: 'AttemptID',
      Evaluations: 'ID',
      Settings: 'SettingKey'
    };

    Object.keys(fullDbObject).forEach(tableName => {
      const records = fullDbObject[tableName];
      if (Array.isArray(records)) {
        rootPayload[tableName] = {};
        const keyField = primaryKeyMap[tableName] || 'ID';
        records.forEach((row, index) => {
          const rawKey = row[keyField] || `auto_${index}`;
          const safeKey = String(rawKey).replace(/[.#$\[\]\/]/g, '_');
          rootPayload[tableName][safeKey] = row;
        });
      }
    });

    await this.db.ref('eduportal').set(rootPayload);
    return { success: true, message: 'Database initialized successfully on Firebase!' };
  }

  /**
   * ฟังก์ชันอัปโหลดไฟล์ไปยัง Google Drive โดยผ่าน Google Apps Script Gateway
   * @param {File} file วัตถุไฟล์จาก Input Element
   * @param {string} customFolderId (ตัวเลือกเสริม) โฟลเดอร์ปลายทางใน Google Drive
   * @returns {Promise<{fileId: string, viewUrl: string, downloadUrl: string, fileName: string}>}
   */
  async uploadFileToDrive(file, customFolderId = null, customGasUrl = null) {
    const targetFolderId = customFolderId || this.driveFolderId || localStorage.getItem('eduportal_drive_folder_id') || '';
    const gatewayUrl = customGasUrl || this.gasDriveGatewayUrl || localStorage.getItem('eduportal_gas_url') || '';

    if (!gatewayUrl || !gatewayUrl.startsWith('https://script.google.com/')) {
      throw new Error('ยังไม่ได้ตั้งค่า Google Apps Script Drive Gateway URL ในระบบ');
    }

    // แปลงไฟล์เป็น Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    // ส่งต่อไปยัง Apps Script (รองรับทั้ง action 'uploadFile' ของ EduPortal Code.gs)
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'uploadFile',
        payload: {
          base64Data: base64Data,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          folderId: targetFolderId
        }
      })
    });

    const resJson = await response.json();
    if (resJson.status === 'error' || (resJson.result && resJson.result.success === false)) {
      throw new Error(resJson.message || resJson.result?.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ไปยัง Google Drive');
    }

    return resJson.result; // มี { success: true, fileUrl, driveFileId, fileName }
  }
}

// สร้าง Singleton Instance พร้อมใช้งาน
window.FirebaseLMS = new FirebaseLmsService();
