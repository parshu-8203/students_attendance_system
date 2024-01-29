import { useState } from "react";
import { fetchRollNumber, updateStudent } from "../../services/apiService";
import editIcon from '../../assets/editStudent.png';
import Loader from "../../services/loader";
import toast from "react-hot-toast";
const EditStudentScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [rollNumber, setRollNumber] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await updateStudent(formData);
            setIsLoading(false);
            toast.success("Details Updated");
        }
        catch (err) {
            setIsLoading(false);
            toast.error("Error while updating, Try again!1");
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
            setIsLoading(true);
            const response = await fetchRollNumber(rollNumber);
            setIsLoading(false);
            setFormData(response);
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };

    return (
        <>
            {isLoading && (<Loader />)}
            <div className="student-container">
                <img src={editIcon} />
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
        </>
    );
}

export default EditStudentScreen;
