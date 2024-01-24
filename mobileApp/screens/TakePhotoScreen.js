import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid ,Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { markAttendance, validateQR } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanScreen = () => {
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        const handleScanResult = async () => {
            if (scanned && scannedData) {
                try {
                    const studentId = await AsyncStorage.getItem("token");
                    const res = await validateQR(scannedData); 
                    const result = await markAttendance(studentId); 
                    Alert.alert('Message',result.message);
                } catch (err) {
                    Alert.alert('Message',err.message);
                }
            }
        };

        handleScanResult();
    }, [scanned, scannedData]);

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setScannedData(data);
    };

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
});

export default ScanScreen;
