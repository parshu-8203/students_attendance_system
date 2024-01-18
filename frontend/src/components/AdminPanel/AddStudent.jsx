import studentIcon from '../../assets/student.png';
import { useState } from 'react';
import { addStudent } from '../../services/apiService';
import { toast } from 'react-hot-toast';
const AddStudent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('Token');
            formData.token = token;
            const { message } = await addStudent(formData);
            toast.success(message, {
                duration: 2000,
            });
            setFormData({
                name: '',
                email: '',
                mobileNumber: '',
                password: '',
            });
        }
        catch (error) {
            console.log("error", error);
            toast.error(error.message, {
                duration: 3000,
            });
        }
    };

    return (
        <div className="add-student-container">
            <img src={studentIcon} />
            <h2 style={{ margin: 0 }}>Add Student</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
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
                    <label htmlFor="email">Email</label>
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
                    <label htmlFor="contactNo">Contact No</label>
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
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default AddStudent;
