import React, { useState } from "react";
import { studentLogin, sendResetLinkEmail } from "../services/apiService";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ToastAndroid } from "react-native";
import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
    // const navigation = useNavigation();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const setToken = async(token) => {
        try 
        {
            await AsyncStorage.setItem('token', token);
            console.log("Token set");   
        }
        catch(err) 
        {
            console.log("error while setting token");
        }
    }

    const onPressLogin = async () => {
        try {
            if(data.email === '' || data.password === '')
            {
                ToastAndroid.show("Can't Kept Empty", ToastAndroid.SHORT);
            }
            const {message, token} = await studentLogin(data);
            await setToken(token);
            // navigation.navigate('Dashboard', {name : "dashboard"});
            console.log(message);
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    const onPressForgotPassword = () => {
        console.log("Clicked Forgot Password");
        toggleModal();
    };

    const onSubmitForgotPassword = async () => {
        try {
            if(data.email === '') {
                ToastAndroid.show("Email Field is Empty", ToastAndroid.SHORT);
            }
            const {message} = await sendResetLinkEmail(data);
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
        catch (err) {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
        }
        // toggleModal();
    };

    return (
        <View style={styles.loginContainer}>
            <Image source={require('../assets/graduation-cap.gif')} style={styles.gifImage} />
            <Text style={styles.text}>Student Login</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(text) => setData((prevData) => ({ ...prevData, email: text }))}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={(text) => setData((prevData) => ({ ...prevData, password: text }))}
                />
            </View>
            <TouchableOpacity onPress={onPressForgotPassword}>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN </Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Forgot Password</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Enter your email"
                            placeholderTextColor="#003f5c"
                            onChangeText={(text) => setData((prevData) => ({ ...prevData, email: text }))}
                        />
                    </View>
                    <TouchableOpacity onPress={onSubmitForgotPassword} style={styles.submitBtn}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    text: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#50586C",
        marginBottom: 40,

    },
    inputView: {
        width: "80%",
        backgroundColor: "#3AB4BA",
        borderRadius: 10,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    gifImage: {
        width: 200,
        height: 200,
    },
    inputText: {
        height: 50,
        color: "white"
    },
    forgotAndSignUpText: {
        color: "white",
        fontSize: 11
    },
    loginBtn: {
        width: "50%",
        backgroundColor: "#DCE2F0",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },

    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20,
    },

    submitBtn: {
        backgroundColor: '#DCE2F0',
        height: 30,
        width: 80,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    submitText: {
        color: 'black',
        fontSize: 16,
    },
});

export default LoginScreen;
