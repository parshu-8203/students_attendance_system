import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import PropTypes from 'deprecated-react-native-prop-types';
const TakePhotoScreen = ({ navigation }) => {
    const onQRCodeScanned = ({ data }) => {
        alert(`Scanned QR code: ${data}`);
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={onQRCodeScanned}
                cameraStyle={{ height: '100%' }}
                reactivate={true}
                reactivateTimeout={2000}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
});

export default TakePhotoScreen;
