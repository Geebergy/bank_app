import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop, Pattern, Circle } from 'react-native-svg';
import { useUser } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

export default function VirtualCards() {
    const { userData, userCardData, handleGetUser, handleGetUserCardData } = useUser();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    
    const refreshData = async () =>{
        const userId = await AsyncStorage.getItem('userId');
        handleGetUser(userId);
        handleGetUserCardData(userId);
      }
    
      useEffect(() => {
        refreshData();
      }, []);


    // Function to generate a new card number
    const generateNewCardNumber = () => {
        const newCardNumber = generateRandomCardNumber();
        setCardNumber(newCardNumber);
        setExpiryDate(generateRandomExpiryDate());
        setCvv(generateRandomCvv());
        refreshData();
    };

    useEffect(() => {
        // Initialize with a random card number on mount
        generateNewCardNumber();
    }, []);

    // Function to generate random card number
    const generateRandomCardNumber = () => {
        let cardNumber = '';
        for (let i = 0; i < 16; i++) {
            cardNumber += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
            if (i > 0 && (i + 1) % 4 === 0 && i < 15) {
                cardNumber += ' '; // Adds space every 4 digits for better readability
            }
        }
        return cardNumber;
    };

    // Function to generate random expiry date
    const generateRandomExpiryDate = () => {
        const month = Math.floor(Math.random() * 12) + 1;
        const year = Math.floor(Math.random() * 5) + 2024;
        return `${month < 10 ? '0' : ''}${month}/${year}`;
    };

    // Function to generate random CVV
    const generateRandomCvv = () => {
        let cvv = '';
        for (let i = 0; i < 3; i++) {
            cvv += Math.floor(Math.random() * 10);
        }
        return cvv;
    };

    // GET CARD API CALL
    function generateRandomReference() {
        const timestamp = Date.now().toString(); // Current timestamp
        const randomString = Math.random().toString(36).substr(2, 8); // Random alphanumeric string
        return `REF-${timestamp}-${randomString}`;
    }

    // Example usage
    const randomRef = generateRandomReference();

    const handleGetCard = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const cardName = userData.firstname + ' ' + userData.lastname;
        const serialKey = `CARD${randomRef}`;

        const userInfo = {
            seria_key: serialKey,
            user_id: userId,
            card_number: cardNumber,
            card_name: cardName,
            card_expiration: expiryDate,
            card_security: cvv,
            card_limit: 5000,
            card_limit_remain: 5000,
            card_status: 2,
        };

        axios.post('https://bank-app-4f6l.onrender.com/user/save_card', userInfo)
            .then(response => {
                Toast.show({
                    type: 'success',
                    text1: 'Card Activated Successfully',
                    position: 'top'
                });
                refreshData();
            })
            .catch(error => {
                console.error('Error with creating card:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to create card',
                    text2: 'Check your details and try again.',
                    position: 'top'
                });
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View>
                    {/* SVG representation of the card */}
                    <Svg width={screenWidth * 0.8} height={screenWidth * 0.5} viewBox="0 0 200 130">
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor="#333" stopOpacity="1" />
                                <Stop offset="1" stopColor="#999" stopOpacity="1" />
                            </LinearGradient>
                            <Pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                <Circle cx="5" cy="5" r="3" fill="#555" />
                            </Pattern>
                        </Defs>

                        {/* Card body */}
                        <Rect x="10" y="10" width="180" height="110" rx="15" ry="15" fill="url(#grad)" />

                        {/* Card desc. */}
                        <SvgText x="20" y="30" fontFamily="Arial" fontSize="10" fill="white" textAnchor="start">
                            Debit Card
                        </SvgText>

                        {/* Card numbers */}
                        <SvgText x="100" y="90" fontFamily="Arial" fontSize="16" fill="white" textAnchor="middle">
                            {userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_number : cardNumber}
                        </SvgText>

                        {/* Username */}
                        <SvgText x="20" y="108" fontFamily="Arial" fontSize="10" fill="white" textAnchor="start">
                            {userData && userData.firstname && userData.lastname && (
                                <Text style={{ marginTop: 140, marginLeft: 45, fontSize: 18, color: 'white' }}>
                                    {userData.firstname} {userData.lastname}
                                </Text>
                            )}
                        </SvgText>

                        {/* Card brand logo (example) */}
                        <SvgText x="165" y="110" fontFamily="Arial" fontSize="10" fill="white" textAnchor="end">
                            VISA
                        </SvgText>
                    </Svg>

                    {/* Card chip image positioned absolutely over the SVG */}
                    <Image
                        source={require('../assets/icons/gold-chip.png')}
                        style={styles.image}
                    />
                </View>

                {/* Card limits */}
                <View>
                    <View style={styles.spaceBetween}>
                        <Text>Card Limit:</Text>
                        <Text>${userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_limit : 5000}</Text>
                    </View>

                    <View style={styles.spaceBetween}>
                        <Text>Available Limit:</Text>
                        <Text style={{ marginLeft: 90 }}>
                            ${userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_limit_remain : 5000}
                        </Text>
                    </View>
                </View>

                {/* Form fields */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        value={userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_number : cardNumber}
                        editable={false}
                    />

                    <View style={styles.row}>
                        <View style={styles.rowContent}>
                            <Text style={styles.label}>Expiry Date</Text>
                            <TextInput
                                style={styles.input}
                                value={userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_expiration : expiryDate}
                                editable={false}
                            />
                        </View>

                        <View style={styles.rowContent}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                value={userCardData && userCardData.cards.length > 0 ? userCardData.cards[0].card_security : cvv}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                {(userCardData.cards.length === 0 || !userCardData) && (
                    <>
                        {/* Button to generate new card */}
                        <TouchableOpacity style={styles.button} onPress={generateNewCardNumber}>
                            <Text style={styles.buttonText}>Generate New Card</Text>
                        </TouchableOpacity>

                        {/* Button to get card */}
                        <TouchableOpacity style={styles.button} onPress={handleGetCard}>
                            <Text style={styles.buttonText}>Get New Card</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        position: 'absolute',
        left: screenWidth * 0.1 + 10, // Aligning the image with the Rect
        top: screenWidth * 0.1 + 30,
        width: 40,
        height: 30,
        borderRadius: 7,
    },
    container: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    formContainer: {
        width: '80%',
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowContent: {
        width: '48%',
    },
    button: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

