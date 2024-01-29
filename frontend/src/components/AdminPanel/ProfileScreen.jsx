import React, { useState, useEffect } from 'react';
import { fetchAdmin } from '../../services/apiService';

const ProfileScreen = ({ onLogout }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
    });

    const fetch = async () => {
        const token = localStorage.getItem('Token');
        const response = await fetchAdmin(token);

        setUserData(response);
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleLogout = () => {
        onLogout(); 
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="user-details">
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <p>Contact Number: {userData.mobileNumber}</p>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfileScreen;
