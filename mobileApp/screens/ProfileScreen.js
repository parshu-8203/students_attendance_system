import {View, Text} from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileScreen = () => {
    const logout = () =>{
        AsyncStorage.removeItem('token');
    }
    useEffect(() => {
        logout();
    }, [])
    return (
        <View>
            <Text>Hello, In Profile</Text>
        </View>
    )
}

export default ProfileScreen;