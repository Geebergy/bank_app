// Section2.js
import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You need to install and link this package

const Section2 = ({ userData, updateUserData }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    return (
        <ScrollView>
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Create Login Credentials</Text>

            {/* Form Fields */}
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={userData.acct_email}
                onChangeText={(text) => updateUserData('acct_email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={userData.acct_phone}
                onChangeText={(text) => updateUserData('acct_phone', text)}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={userData.acct_username}
                onChangeText={(text) => updateUserData('acct_username', text)}
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={userData.acct_password}
                    onChangeText={(text) => updateUserData('acct_password', text)}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                >
                    <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    value={userData.confirmPassword}
                    onChangeText={(text) => updateUserData('confirmPassword', text)}
                    secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                    <Icon name={confirmPasswordVisible ? 'visibility' : 'visibility-off'} size={20} />
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
});

export default Section2;
