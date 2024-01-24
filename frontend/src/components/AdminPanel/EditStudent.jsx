import { useState } from "react";
import axios from 'axios';
import { fetchRollNumber, updateStudent } from "../../services/apiService";
import editIcon from '../../assets/editStudent.png';
import toast from "react-hot-toast";
const EditStudentScreen = () => {

    const [formData, setFormData] = useState(null);
    const [rollNumber, setRollNumber] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateStudent(formData);
            toast.success("Details Updated");
        }
        catch (err) {
            console.log("Error while updating", err);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
            <img src={editIcon}/>
            <h2 style={{ margin: "10px" }}>Edit Student</h2>
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
                            <label htmlFor="email">Update Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Update Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNo">Update Contact No</label>
                            <input
                                type="tel"
                                id="contactNo"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Update Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Update Data</button>

                    </>
                }
            </form>
        </div>
    );
}

export default EditStudentScreen;
