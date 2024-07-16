import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Section1 from '../sections/Section1';
import Section2 from '../sections/Section2';
import Section3 from '../sections/Section3'; // We'll define Section3 next
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from 'react-native-paper'; // Assuming you're using React Native Paper for ProgressBar
import { color } from 'react-native-elements/dist/helpers';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationForm = ({navigation}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Central state to collect user data
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        acct_currency: '',
        acct_type: '',
        acct_occupation: '',
        country: '',
        acct_email: '',
        acct_phone: '',
        acct_username: '',
        acct_password: '',
        confirmPassword: '',
        acct_pin: '',
    });

    const handleNext = () => {
        if (currentPage < 3) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    const handleConfirm = async () => {
        if (userData.acct_password !== userData.confirmPassword) {
          Toast.show({
            type: 'error',
            text1: 'Passwords do not match',
            position: 'top'
          });
          return; // Exit function early if passwords don't match
        }
      
        console.log('Button tapped');
      
        axios.post('http://192.168.140.241:3003/user/createUser', userData)
          .then(response => {
            Toast.show({
              type: 'success',
              text1: 'User Account Created Successfully',
              position: 'top'
            });
            // Optionally, you can navigate to another screen or reset form fields
            navigation.navigate('LoginForm');
          })
          .catch(error => {
            let errorMessage = 'Failed to create account. Check your details and try again';
            if (error.response && error.response.data && error.response.data.error) {
              errorMessage = error.response.data.error;
            }
            console.error('Error creating user:', error);
            Toast.show({
              type: 'error',
              text1: 'Failed to create account',
              text2: errorMessage,
              position: 'top'
            });
          });
      };
      

    const updateUserData = (key, value) => {
        setUserData((prevState) => ({ ...prevState, [key]: value }));
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
            
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={(currentPage - 1) / 2} // Adjust based on number of sections
                    color="#6a3093" // Progress bar color
                    style={styles.progressBar}
                />
                <Text style={styles.progressText}>{`Page ${currentPage} of 3`}</Text>
            </View>

            {/* Sections */}
            {currentPage === 1 && (
                <Section1 userData={userData} updateUserData={updateUserData} navigation={navigation}/>
            )}
            {currentPage === 2 && (
                <Section2 userData={userData} updateUserData={updateUserData} />
            )}
            {currentPage === 3 && (
                <Section3 userData={userData} updateUserData={updateUserData} />
            )}


            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                {currentPage > 1 && (
                    <TouchableOpacity style={styles.backArrow} onPress={handlePrevious} >
                        <Ionicons
                            name="arrow-back"
                            color='white'
                            size={24}
                        />
                    </TouchableOpacity>
                )}
                {currentPage < 3 && (
                    <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                        <View style={styles.spaceBetween}>
                        <Text style={{color: 'white', fontSize: 15}}>Next</Text>
                        <Ionicons
                            name="arrow-forward"
                            color='white'
                            size={20}
                        />
                        </View>
                    </TouchableOpacity>
                )}
                {currentPage === 3 && (
                    <TouchableOpacity style={styles.checkButton}>
                    <Ionicons
                        name="checkmark"
                        color='white'
                        size={24}
                        onPress={handleConfirm}
                    />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    background: {
        // flex: 1,
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
    progressContainer: {
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 10,
        borderRadius: 5,
    },
    progressText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 16,
        color: '#6a3093',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backArrow: {
        backgroundColor: 'purple',
        borderRadius: 100,
        alignItems: 'center',
        padding: 10,
    },
    checkButton:{
        backgroundColor: 'purple',
        borderRadius: 100,
        alignItems: 'center',
        padding: 12,
    },
    nextBtn: {
      backgroundColor: 'purple',
      color: 'white',
      borderRadius: 25,
      padding: 14,
      width: 90,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default RegistrationForm;
