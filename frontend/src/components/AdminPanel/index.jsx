import './index.css';
import { useState, useEffect } from 'react';
import { getStudentByRollNumber, getStudentByDate } from '../../services/apiService';
import toast from 'react-hot-toast';
import { setAttendanceStatus } from '../../services/apiService';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import Loader from '../../services/loader';

const Admin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [rollNumber, setRollNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const exportToExcel = () => {
        if (attendanceRecords.length === 0)
            return toast.error("No records found");
        const worksheet = XLSX.utils.json_to_sheet(attendanceRecords);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');
        XLSX.writeFile(workbook, 'attendance_records.xlsx');
    };

    const exportToPDF = () => {
        if (attendanceRecords.length === 0) {
            return toast.error("No records found");
        }
        const tableElement = document.createElement('table');
        tableElement.classList.add('attendance-table');

        const theadElement = document.createElement('thead');
        theadElement.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Status</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
            </tr>
        `;
        tableElement.appendChild(theadElement);


        const tbodyElement = document.createElement('tbody');
        attendanceRecords.forEach((record) => {
            const trElement = document.createElement('tr');
            trElement.innerHTML = `
                <td>${record.name}</td>
                <td>${record.rollNumber}</td>
                <td>${record.status ? 'Present' : 'Absent'}</td>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.inTime}</td>
                <td>${record.outTime}</td>
            `;
            tbodyElement.appendChild(trElement);
        });
        tableElement.appendChild(tbodyElement);

        const pdfContainer = document.createElement('div');
        pdfContainer.appendChild(tableElement);

        html2pdf(pdfContainer);
    };


    const searchByRollNumber = async () => {


        try {
            setIsLoading(true);
            const res = await getStudentByRollNumber(rollNumber);
            setAttendanceRecords(res);
        } catch (err) {
            toast.error(err.message);
        }
        setIsLoading(false);
    };

    const searchByDate = async () => {
        try {
            setIsLoading(true);
            const res = await getStudentByDate(selectedDate);
            setAttendanceRecords(res);
        } catch (err) {
            toast.error("Error while fetching, Try again!!");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        searchByDate();
    }, [selectedDate]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const [editRecordId, setEditRecordId] = useState(null);
    const [editedStatus, setEditedStatus] = useState(null);

    const handleEditStatus = (recordId) => {
        setEditRecordId(recordId);
    };

    const handleStatusChange = (status) => {
        setEditedStatus(status);
    };

    const handleSubmitStatus = async (recordId) => {
        try {
            if (editedStatus !== null) {
                await setAttendanceStatus(recordId, editedStatus);
                setEditRecordId(null);
                setEditedStatus(null);
                toast.success('Status updated successfully');
            } else {
                toast.warning('No changes made.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);

    return (
        <>
            {
                isLoading && (<Loader />)
            }
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

                </div>
                <div className="export-section">
                    <label>Export Records:</label>
                    <select onChange={(e) => e.target.value !== 'none' && (e.target.value === 'excel' ? exportToExcel() : exportToPDF())}>
                        <option value="none">Select download option</option>
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                    </select>
                </div>
                <div className="attendance-records">
                    {attendanceRecords.length === 0 ? (
                        <p>No records found.</p>
                    ) : (
                        <>
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Roll Number</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>In Time</th>
                                        <th>Out Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((record) => (
                                        <tr key={record._id} className="attendance-row">
                                            <td>{record.name}</td>
                                            <td>{record.rollNumber}</td>
                                            <td>
                                                {editRecordId === record._id ? (
                                                    <select
                                                        value={editedStatus !== null ? editedStatus : record.status}
                                                        onChange={(e) => handleStatusChange(e.target.value)}
                                                    >
                                                        <option value={true}>Present</option>
                                                        <option value={false}>Absent</option>
                                                    </select>
                                                ) : (
                                                    record.status ? 'Present' : 'Absent'
                                                )}
                                            </td>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>{record.inTime}</td>
                                            <td>{record.outTime}</td>
                                            <td>
                                                {editRecordId === record._id ? (
                                                    <button className="action-submit-button" onClick={() => handleSubmitStatus(record._id)}>Submit</button>
                                                ) : (
                                                    <button className="action-edit-button" onClick={() => handleEditStatus(record._id)}>Edit</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                {Array.from({ length: Math.ceil(attendanceRecords.length / recordsPerPage) }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Admin;