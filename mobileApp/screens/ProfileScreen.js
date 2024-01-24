import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchStudentDetails,fetchAttendanceSummary } from '../services/apiService';
import { Card, Title, Paragraph, Button } from 'react-native-paper'; // You can replace these components with your preferred UI library
const ProfileScreen = ({ navigation, onLogout }) => {
    const [studentDetails, setStudentDetails] = useState({
        name: '',
        email: '',
        rollNumber: '',
    });
    const [attendanceSummary, setAttendanceSummary] = useState({
        totalClasses: 0,
        attendedClasses: 0,
        attendancePercentage: 0,
    });

    const fetchDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetchStudentDetails(token);
            setStudentDetails(response.data);
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetchAttendanceSummary(token);
            const percentage = (response.data.attendedClasses / response.data.totalClasses) * 100 || 0;
            setAttendanceSummary({
                ...response.data,
                attendancePercentage: percentage.toFixed(2),
            });
        } catch (error) {
            console.error('Error fetching attendance summary:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            onLogout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        fetchDetails();
        fetchSummary();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Name: {studentDetails.name}</Text>
                <Text style={styles.detailText}>Email: {studentDetails.email}</Text>
                <Text style={styles.detailText}>Roll Number: {studentDetails.rollNumber}</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Total Classes</Title>
                    <Paragraph>{attendanceSummary.totalClasses}</Paragraph>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Attended Classes</Title>
                    <Paragraph>{attendanceSummary.attendedClasses}</Paragraph>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Attendance Percentage</Title>
                    <Paragraph>{attendanceSummary.attendancePercentage}%</Paragraph>
                </Card.Content>
            </Card>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
    },
    card: {
        marginBottom: 20,
        backgroundColor:"#ffffff",
        width: '80%',
        elevation: 5, 
    },
    logoutButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProfileScreen;
