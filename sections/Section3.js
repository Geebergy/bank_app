// Section3.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';

const Section3 = ({ userData, updateUserData }) => {
    return (
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.header}>Are your details correct?</Text>
            <Text>First Name: {userData.firstname}</Text>
            <Text>Last Name: {userData.lastname}</Text>
            <Text>Currency: {userData.acct_currency}</Text>
            <Text>Account Type: {userData.acct_type}</Text>
            <Text>Occupation: {userData.acct_occupation}</Text>
            <Text>Country: {userData.country}</Text>
            <Text>Email Address: {userData.acct_email}</Text>
            <Text>Phone Number: {userData.acct_phone}</Text>
            <Text>Username: {userData.acct_username}</Text>
            {/* Passwords are intentionally not displayed */}

            
        </View>
        <View style={styles.container}>
        <Text style={{marginBottom: 10}}>Set Up Your Pin</Text>
            <TextInput
                style={styles.input}
                placeholder="Set Pin"
                value={userData.acct_pin}
                onChangeText={(text) => updateUserData('acct_pin', text)}
                keyboardType="phone-pad"
            />
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Section3;
