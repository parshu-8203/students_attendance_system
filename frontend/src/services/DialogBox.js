import React, { useState } from 'react';
import { sendResetPasswordEmail } from "./apiService";
import { toast } from 'react-hot-toast';
const DialogBox = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const handleSendEmail = async () => {

        if (email) {
            try {
                onClose();
                const res = await toast.promise(
                    sendResetPasswordEmail(email),
                    {
                        loading: 'Sending reset email...',
                        success: <b>Email sent successfully!</b>,
                        error: <b>Admin with this email not found.</b>,
                    }
                );
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            toast.error("Email can't be empty", {
                duration: 3000,
            })
        }
    }


    return (

        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">

                <p>Enter your email to receive a reset link:</p>
                <input
                    required
                    type="email"
                    value={email} suppressContentEditableWarning
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type='button' onClick={handleSendEmail}>Submit</button>
                <button id="close" type="button" onClick={onClose}>Close</button>
            </div>
        </div>

    );
};

export default DialogBox;
