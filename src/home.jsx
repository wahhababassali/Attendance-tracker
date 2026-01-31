import React, { useEffect, useMemo, useState } from 'react';

// cspell:disable
const sampleStudents = [
  { id: '01242902B', name: 'ABADA, EMMANUEL', status: 'absent' },
  { id: '01242147B', name: 'ABDULAI, WAHHAB ALI', status: 'absent' },
  { id: '01243635B', name: 'ABOAGYE, DERRICK', status: 'absent' },
  { id: '01241681B', name: 'ACKUAYI, KELLY MAWULI', status: 'absent' },
  { id: '01243717B', name: 'ADJEI KWAME SARPONG', status: 'absent' },
  { id: '01243815B', name: 'ADOBOE KENNEDY SEYRAM', status: 'absent' },
  { id: '01242974B', name: 'ADOMAKO JEFFERY SARPONG', status: 'absent' },
  { id: '01242068B', name: 'AGBESI JAMES', status: 'absent' },
  { id: '01242453B', name: 'AGU JERRY TAMAKLOE', status: 'absent' },
  { id: '01243134B', name: 'AGYAPONG FRANCIS KOFI', status: 'absent' },
  { id: '01243236B', name: 'AGYEI ANDREW DARKO', status: 'absent' },
  { id: '01243860B', name: 'ALLOTEY JESSICA EMMANUELLA AKUSHIKA', status: 'absent' },
  { id: '01243202B', name: 'AMOAKO KOJO', status: 'absent' },
  { id: '01245284B', name: 'AMPAH-BAIDEN KENNEDY', status: 'absent' },
  { id: '01243264B', name: 'ANNAN DEBORAH', status: 'absent' },
  { id: '01243364B', name: 'ASARE EDMOND', status: 'absent' },
  { id: '01242604B', name: 'ASHONG RAYMOND NII NOI', status: 'absent' },
  { id: '01242601B', name: 'ASONGA GABRIEL', status: 'absent' },
  { id: '01241670B', name: 'AWUAH ALBERT KWAME', status: 'absent' },
  { id: '01242367B', name: 'BACHURI AMOS MPROMOR', status: 'absent' },
  { id: '01241578B', name: 'CHIDIACK PRINCE REMIA', status: 'absent' },
  { id: '01241471B', name: 'DAKEY KELVIN KOJO', status: 'absent' },
  { id: '01242387B', name: 'DANSO ONEILL', status: 'absent' },
  { id: '01242291B', name: 'DOGBE MILLICENT WOYRAM', status: 'absent' },
  { id: '01241793B', name: 'KWAKYE DERRICK', status: 'absent' },
  { id: '01242431B', name: 'LARKAI HAZEL LARTELEY', status: 'absent' },
  { id: '01241423B', name: 'LARTEY RICHMOND', status: 'absent' },
  { id: '01241847B', name: 'MBIAH AMOS ADU', status: 'absent' },
  { id: '01242011B', name: 'MILLS IBRAHIM LANTEY', status: 'absent' },
  { id: '01242129B', name: 'NARTEH WILBERG MANTEY', status: 'absent' },
  { id: '01242527B', name: 'NYARKO PRINCE SAMUEL KOFI', status: 'absent' },
  { id: '01242507B', name: 'SALIMA JOHN GABUJA', status: 'absent' },
  { id: '01242300B', name: 'ZAYE, EPHRAIM KWAMI', status: 'absent' },
  { id: '01246049B', name: 'DIAKITE IBRAHIM', status: 'absent' }
];

export default function Home() {
  const [attendanceData, setAttendanceData] = useState(() => {
    try {
      const saved = localStorage.getItem('attendance_demo');
      return saved ? JSON.parse(saved) : sampleStudents;
    } catch (e) {
      return sampleStudents;
    }
  });

  const [course, setCourse] = useState('ATU 203 - LOGIC AND CRITICAL THINKING');
  const [search, setSearch] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notification, setNotification] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lecturerName, setLecturerName] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance_demo', JSON.stringify(attendanceData));
  }, [attendanceData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendanceData;
    return attendanceData.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }, [attendanceData, search]);

  function showNotification(message, type = 'info') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function getCourseCode(courseStr) {
    if (!courseStr) return '';
    return courseStr.split(' - ')[0].trim();
  }

  function getCourseName(courseStr) {
    if (!courseStr) return '';
    const parts = courseStr.split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ').trim() : courseStr;
  }

  function markStudent(index, status) {
    setAttendanceData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status };
      return copy;
    });
    showNotification(`${attendanceData[index]?.name || 'Student'} marked ${status}`, 'success');
  }

  function markAll(status) {
    setAttendanceData(prev => prev.map(s => ({ ...s, status })));
    showNotification(`All marked ${status}`, 'success');
  }

  function resetAttendance() {
    if (!confirm("Reset today's attendance?")) return;
    setAttendanceData(prev => prev.map(s => ({ ...s, status: 'absent' })));
    showNotification('Attendance reset', 'success');
  }

  function saveAttendance() {
    const date = new Date().toISOString().split('T')[0];
    const code = getCourseCode(course);
    const name = getCourseName(course);
    const payload = { courseCode: code, courseName: name, date, students: attendanceData };
    localStorage.setItem(`attendance_${code}_${date}`, JSON.stringify(payload));
    showNotification('Attendance saved!', 'success');
  }

  async function exportPDF() {
    try {
      showNotification('Generating PDF...', 'info');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const date = new Date().toLocaleDateString();
      doc.setFontSize(18);
      doc.setTextColor(74, 107, 255);
      doc.text('Attendance Report', 105, 20, null, null, 'center');
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const code = getCourseCode(course);
      const name = getCourseName(course);
      doc.text(`Course: ${name}`, 20, 35);
      doc.text(`Code: ${code}`, 20, 42);
      doc.text(`Date: ${date}`, 20, 49);

      let yPos = 60;
      doc.setFontSize(10);
      attendanceData.forEach((s, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.text(s.id.substring(0, 18), 20, yPos);
        doc.text(s.name.substring(0, 30), 80, yPos);
        doc.text(s.status, 160, yPos);
        yPos += 7;
      });

      // Add signature space
      yPos += 15;
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 80, yPos);
      doc.setFontSize(9);
      doc.text('Lecturer Signature', 20, yPos + 5);
      if (lecturerName) {
        doc.text(`Name: ${lecturerName}`, 100, yPos + 5);
      }

      doc.save(`attendance_${new Date().toISOString().split('T')[0]}.pdf`);
      showNotification('PDF downloaded!', 'success');
    } catch (e) {
      console.error(e);
      showNotification('PDF failed, try CSV', 'error');
    }
  }

  function exportCSV() {
    const date = new Date().toISOString().split('T')[0];
    const code = getCourseCode(course);
    const name = getCourseName(course);
    let csv = `Course Code,${code}\nCourse Name,"${name}"\n\n`;
    csv += 'Student ID,Full Name,Status,Date\n';
    attendanceData.forEach(s => csv += `${s.id},"${s.name}",${s.status},${date}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `attendance_${date}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showNotification('CSV downloaded!', 'success');
  }

  function exportExcel() {
    exportCSV();
    showNotification('Excel exported (CSV fallback)', 'success');
  }

  function printAttendance() { showNotification('Opening print...', 'info'); setTimeout(() => window.print(), 300); }

  const presentCount = attendanceData.filter(s => s.status === 'present').length;
  const absentCount = attendanceData.filter(s => s.status === 'absent').length;
  const lateCount = attendanceData.filter(s => s.status === 'late').length;
  const totalCount = attendanceData.length;

  return (
    <div className="container">
      {notification && (
        <div className="notification" style={{ background: notification.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(74,107,255,0.95)'}}>{notification.message}</div>
      )}

      <header>
        <div className="logo">
          <div className="logo-icon"><i className="fas fa-chalkboard-teacher"></i></div>
          <div className="logo-text">
            <h1>Special Btech Attendance Tracker</h1>
            <p>For Course Representatives</p>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
          <div className="date-info">
            <div className="current-date">{currentDate}</div>
            <select id="course-select" className="course-selector" value={course} onChange={e => setCourse(e.target.value)}>
              <option value="ATU 203 - LOGIC AND CRITICAL THINKING">ATU 203 - LOGIC AND CRITICAL THINKING </option>
              <option value="BCP 201 - PROGRAMMING WITH C++ OOP">BCP 201 - PROGRAMMING WITH C++ OOP</option>
              <option value="BCP 203 - COMPUTER ORGANISATION AND ARCHITECTURE">BCP 203 - COMPUTER ORGANISATION AND ARCHITECTURE </option>
              <option value="BCP 205 - DATA COMMUNICATION AND COMPUTER NETWORK">BCP 205 - DATA COMMUNICATION AND COMPUTER NETWORK</option>
              <option value="ATU 201 - INTRODUCTION TO PRINCIPLES OF ENTREPRENEUSHIP">ATU 201 - INTRODUCTION TO PRINCIPLES OF ENTREPRENEUSHIP</option>
              <option value="ATU 209 - PRINCIPLES AND APPLICATION IN SUSTAINABILITY">ATU 209 - PRINCIPLES AND APPLICATION IN SUSTAINABILITY </option>
              <option value="BCP 207 - WEB DEVELOPMENT TECHNOLOGY 1">BCP 207 - WEB DEVELOPMENT TECHNOLOGY 1</option>
            
            </select>
            <input 
              type="text" 
              className="course-selector" 
              placeholder="Enter Lecturer Name" 
              value={lecturerName} 
              onChange={e => setLecturerName(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="dashboard-cards">
        <div className="card present">
          <div className="card-icon">✅</div>
          <h3>Present Today</h3>
          <div className="value" id="present-count">{presentCount}</div>
          <p>Students in class</p>
        </div>
        <div className="card absent">
          <div className="card-icon">❌</div>
          <h3>Absent Today</h3>
          <div className="value" id="absent-count">{absentCount}</div>
          <p>Students missing</p>
        </div>
        <div className="card late">
          <div className="card-icon">⏰</div>
          <h3>Late Today</h3>
          <div className="value" id="late-count">{lateCount}</div>
          <p>Students arrived late</p>
        </div>
        <div className="card total">
          <div className="card-icon">👥</div>
          <h3>Total Students</h3>
          <div className="value" id="total-count">{totalCount}</div>
          <p>Enrolled in course</p>
        </div>
      </div>

      <div className="control-panel">
        <h2><i className="fas fa-sliders-h"></i> Attendance Controls</h2>
        <div className="controls">
          <button className="btn btn-primary" onClick={() => markAll('present')}><i className="fas fa-check-circle"></i> Mark All Present</button>
          <button className="btn btn-outline" onClick={() => markAll('absent')}><i className="fas fa-times-circle"></i> Mark All Absent</button>
          <button className="btn btn-danger" onClick={resetAttendance}><i className="fas fa-redo"></i> Reset Today</button>
          <button className="btn btn-success" onClick={saveAttendance}><i className="fas fa-save"></i> Save</button>
        </div>
      </div>

      <div className="attendance-section">
        <div className="attendance-header">
          <h2><i className="fas fa-list-check"></i> Student Attendance</h2>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." />
          </div>
        </div>

        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th width="15%">Student ID</th>
                <th width="30%">Full Name</th>
                <th width="20%">Status</th>
                <th width="35%">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr key={student.id}>
                  <td className="student-id">{student.id}</td>
                  <td className="student-name">{student.name}</td>
                  <td>
                    <div className={`status-badge ${student.status === 'present' ? 'status-present' : student.status === 'absent' ? 'status-absent' : 'status-late'}`}>
                      <i className={`fas ${student.status === 'present' ? 'fa-check-circle' : student.status === 'absent' ? 'fa-times-circle' : 'fa-clock'}`}></i>
                      <span>{student.status === 'present' ? 'Present' : student.status === 'absent' ? 'Absent' : 'Late'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="status-checkboxes" role="group" aria-label={`Set status for ${student.name}`}>
                      <label className={`checkbox ${student.status === 'present' ? 'present-checked' : ''}`}>
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          checked={student.status === 'present'}
                          onChange={() => markStudent(attendanceData.indexOf(student), 'present')}
                          aria-label={`Mark ${student.name} present`}
                        />
                        <span className="box"><i className="fas fa-check" aria-hidden="true"></i></span>
                      </label>

                      <label className={`checkbox ${student.status === 'late' ? 'late-checked' : ''}`}>
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          checked={student.status === 'late'}
                          onChange={() => markStudent(attendanceData.indexOf(student), 'late')}
                          aria-label={`Mark ${student.name} late`}
                        />
                        <span className="box"><i className="fas fa-clock" aria-hidden="true"></i></span>
                      </label>

                      <label className={`checkbox ${student.status === 'absent' ? 'absent-checked' : ''}`}>
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          checked={student.status === 'absent'}
                          onChange={() => markStudent(attendanceData.indexOf(student), 'absent')}
                          aria-label={`Mark ${student.name} absent`}
                        />
                        <span className="box"><i className="fas fa-times" aria-hidden="true"></i></span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="export-section">
        <h2><i className="fas fa-download"></i> Export Attendance</h2>
        <div className="export-options">
          <button className="btn btn-outline" onClick={exportPDF}><i className="fas fa-file-pdf"></i> PDF</button>
          <button className="btn btn-outline" onClick={exportExcel}><i className="fas fa-file-excel"></i> Excel</button>
          <button className="btn btn-outline" onClick={exportCSV}><i className="fas fa-file-csv"></i> CSV</button>
          <button className="btn btn-outline" onClick={printAttendance}><i className="fas fa-print"></i> Print</button>
        </div>
      </div>

      <footer>
        <p>Course Attendance Tracker © {new Date().getFullYear()}</p>
        <p className="no-print">Optimized for mobile & desktop</p>
      </footer>
    </div>
  );
}
