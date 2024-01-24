import { useState } from "react";
import axios from 'axios';
import { fetchRollNumber, deleteStudent } from "../../services/apiService";
import deleteIcon from '../../assets/deleteStudent.png';
import toast from "react-hot-toast";
const DeleteStudentScreen = () => {

    const [formData, setFormData] = useState(null);
    const [rollNumber, setRollNumber] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteStudent(formData);
            toast.success("Student Deleted");
            setFormData(null);
        }
        catch (err) {
            console.log("Error while updating", err);
        }
    }

    const handleFetchData = async () => {
        try {
            const response = await fetchRollNumber(rollNumber);;
            setFormData(response);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="student-container">
            <img src={deleteIcon} />
            <h2 style={{ margin: "10px" }}>Delete Student</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="fetch-student">
                        <label htmlFor="rollNumber">Roll Number</label>
                        <input
                            type="text"
                            id="rollNumber"
                            name="rollNumber"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            required
                        />
                        <center>
                            <button style={{ marginTop: "5px" }} type="button" onClick={handleFetchData}>Fetch Data</button>
                        </center>
                    </div>
                </div>
                {formData &&
                    <>
                        <div className="form-group">
                            <label htmlFor="email">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                disabled
                                value={formData.name}

                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                disabled
                                name="email"
                                value={formData.email}

                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNo">Contact No</label>
                            <input
                                type="tel"
                                id="contactNo"
                                disabled
                                name="mobileNumber"
                                value={formData.mobileNumber}

                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                disabled
                                value={formData.password}

                                required
                            />
                        </div>
                        <button style={{ backgroundColor: "red" }} type="submit">Delete Data</button>
                    </>
                }
            </form>
        </div>
    );
}

export default DeleteStudentScreen;
