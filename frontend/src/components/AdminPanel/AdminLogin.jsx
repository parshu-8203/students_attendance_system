import React, { useState } from 'react';
import AdminImage from '../../assets/adminImage.png';
import { login } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import DialogBox from '../../services/DialogBox';
import Loader from '../../services/loader';
import { toast } from 'react-hot-toast';
const AdminLogin = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [boxOpen, setBoxOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        try {
            const { message, token } = await login(email, password);
            localStorage.setItem('Token', token);
            setIsLoading(false);
            setTimeout(() => {
                navigate('/admin');
                onLogin();
            }, 1000);
            toast.success(message, {
                duration: 2000,
            });
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message, {
                duration: 3000,
            });
        }
    };
    const dialogBoxOpen = () => {
        setBoxOpen(true);
    }
    const dialogBoxClose = () => {
        setBoxOpen(false);
    }

    return (
        <>
            {isLoading &&
                <Loader />
            }
            <form onSubmit={handleLogin}>
                <div className="container">
                    <div className="leftSection">
                        <img
                            src={AdminImage}
                            alt="Admin Image"
                            className="image"
                        />
                    </div>
                    <div className="rightSection">
                        <h2>Login</h2>
                        <div>
                            <p>Email</p>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <p>Password</p>
                            <input
                                type="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="forgotPassword">
                            <a onClick={dialogBoxOpen}>Forgot Password?</a>
                        </div>
                        <button type='submit'>Login</button>
                        {boxOpen ? (<DialogBox
                            isOpen={dialogBoxOpen}
                            onClose={dialogBoxClose}
                        />) : <>
                        </>
                        }
                    </div>
                </div>

            </form>
        </>
    );
};


export default AdminLogin;
