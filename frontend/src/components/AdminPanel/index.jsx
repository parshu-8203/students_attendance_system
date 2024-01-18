import './index.css';
import { useState, useEffect } from 'react';
import { getStudentByRollNumber, getStudentByDate } from '../../services/apiService';
const Admin = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const searchByRollNumber = async () => {
        try {
            const res = await getStudentByRollNumber(rollNumber);
            setAttendanceRecords(res);
        }
        catch (err) {
            console.log(err);
        }
    };

    const searchByDate = async () => {
        try {
            const res = await getStudentByDate(selectedDate);
            setAttendanceRecords(res);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        searchByDate();
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Attendance Dashboard</h1>
            <div className="search-section">
                <div className="search-input">
                    <label>Search by Roll Number:</label>
                    <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                    />
                </div>
                <button className="search-button" onClick={searchByRollNumber}>
                    Search
                </button>
            </div>
            <div className="search-section">
                <div className="search-input">
                    <label>Search by Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <button className="search-button" onClick={searchByDate}>
                    Search
                </button>
            </div>
            <div className="attendance-records">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>In Time</th>
                            <th>Out Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((record) => (
                            <tr key={record._id} className="attendance-row">
                                <td>{record.name}</td>
                                <td>{record.rollNumber}</td>
                                <td>{record.status ? 'Present' : 'Absent'}</td>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{record.inTime}</td>
                                <td>{record.outTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Admin;