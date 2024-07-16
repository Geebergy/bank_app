import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const LoginForm = ({ navigation }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loadingPage, setLoadingPage] = useState(false);


// Function to handle user login
const handleLogin = async () => {
    setLoadingPage(true);
    try {
        const userData = {
            username: username,
            password: password,
        };

        const response = await axios.post('https://bank-app-4f6l.onrender.com/user/userLogin', userData);

        if (response.status === 200) {
            const { userId } = response.data;
            await AsyncStorage.setItem('userId', userId.toString()); // Convert userId to string
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                position: 'top'
            });
            setLoadingPage(false);
            navigation.navigate('Main');
        } else {
            setLoadingPage(false);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Please confirm your details and try again',
                position: 'top'
            });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Please confirm your details and try again',
            position: 'top'
        });
        setLoadingPage(false);
    }
};

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#6a3093', '#a044ff']}
                style={styles.background}
            >
                <View style={styles.container}>
                    <LottieView
                        style={{ alignItems: 'center', height: 100, width: 100 }}
                        source={require('../assets/animations/secureTx.json')}
                        autoPlay
                        loop
                        onError={(error) => console.log('Lottie error:', error)}
                    />
                </View>
                <Text style={styles.welcomeText}>
                    Welcome to Our App!
                </Text>
            </LinearGradient>

            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.header}>Login To Your Account</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        autoCapitalize="none"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={!passwordVisible}
                        />
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                            <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={20} />
                        </TouchableOpacity>
                    </View>

                    {loadingPage ? (
                        <ActivityIndicator />
                    ):
                    (
                    <TouchableOpacity onPress={handleLogin} style={styles.submitBtn}>
                        <View style={styles.spaceBetween}>
                            <Text style={{ color: 'white', fontSize: 15, marginRight: 8 }}>Submit</Text>
                            <Ionicons
                                name="arrow-forward"
                                color='white'
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={{ color: 'purple', textAlign: 'right', marginTop: 20 }}>Create account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    background: {
        justifyContent: 'center',
        height: 150,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    icon: {
        padding: 10,
    },
    submitBtn: {
        backgroundColor: 'purple',
        color: 'white',
        borderRadius: 25,
        padding: 14,
        marginTop: 10,
        width: 90,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default LoginForm;
