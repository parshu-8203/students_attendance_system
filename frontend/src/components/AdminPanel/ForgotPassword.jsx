import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyResetToken, resetPassword } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await verifyResetToken(token);
                setIsTokenValid(true);
            } catch (error) {
                setIsTokenValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        try {
            if (newPassword !== repeatNewPassword) {
                toast.error('Passwords do not match');
                return;
            }
            await resetPassword(token, newPassword);
            toast.success('Password reset successfully', {
                duration: 2000
            });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            toast.success(error.message, {
                duration: 3000
            })
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isTokenValid) {
        return <p>Invalid or expired reset token.</p>;
    }

    return (
        <form onSubmit={handleChangePassword}>
            <div class="forgotPasswordContainer">
                <p>Enter your new password:</p>
                <input
                    type="password"
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <p>Repeat your new password:</p>
                <input
                    type="password"
                    value={repeatNewPassword}
                    required
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default ForgotPassword;
