import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;

export default function DomesticTransfer() {
  
  const initialFormState = {
    amount: '',
    selectedValue: 'none',
    beneficiaryAccountName: '',
    bankName: '',
    beneficiaryAccountNumber: '',
    text: ''
  };
  
  const { userData, handleGetUser } = useUser();
  const [amount, setAmount] = useState('');
  const [selectedValue, setSelectedValue] = useState('none');
  const [beneficiaryAccountName, setBeneficiaryAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [text, setText] = useState('');

  const refreshData = async () =>{
    const userId = await AsyncStorage.getItem('userId');
    handleGetUser(userId);
  }

  useEffect(() => {
    refreshData();
  }, []);

  const resetForm = () => {
    setAmount(initialFormState.amount);
    setSelectedValue(initialFormState.selectedValue);
    setBeneficiaryAccountName(initialFormState.beneficiaryAccountName);
    setBankName(initialFormState.bankName);
    setBeneficiaryAccountNumber(initialFormState.beneficiaryAccountNumber);
    setText(initialFormState.text);
  };
  

  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue);
  };


  // 

  function generateRandomReference() {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomString = Math.random().toString(36).substr(2, 8); // Random alphanumeric string
  
    return `REF-${timestamp}-${randomString}`;
  }
  
  // Example usage
  const randomRef = generateRandomReference();

  const handleConfirm = async () => {
    if(userData && userData.acct_balance){
      if(amount > userData.acct_balance){
        Toast.show({
          type: 'error',
          text1: 'Insufficient Funds',
          position: 'top'
        });
      }
      else{
        const userId = await AsyncStorage.getItem('userId');

    
  const userData = {
    acct_id: userId,
    refrence_id: randomRef,
    amount: amount,
    bank_name: bankName,
    acct_name: beneficiaryAccountName,
    acct_number: beneficiaryAccountNumber,
    trans_type: 'domestic-transfer',
    acct_type: selectedValue,
    acct_remarks: text,
    dom_status: 1,
};

    axios.post('http://192.168.140.241:3003/user/domestic_transfer', userData)
    .then(response => {
      Toast.show({
        type: 'success',
        text1: 'Transfer Successful',
        position: 'top'
      });
      resetForm(); // Reset form fields
      refreshData();

    })
    .catch(error => {
      console.error('Error with domestic transfer:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to complete transfer',
        text2: 'Please confirm your details and try again',
        position: 'top'
      });
    });
      }
    }
    
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 40, fontWeight: '100' }}>Domestic Transfer</Text>

        {/* Amount */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={text => setAmount(text)}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
          </View>
        </View>

        {/* Beneficiary Account Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Beneficiary Account Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={beneficiaryAccountName}
              onChangeText={text => setBeneficiaryAccountName(text)}
              keyboardType="default"
              placeholder="Beneficiary Account Name"
            />
          </View>
        </View>

        {/* Bank Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bank Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={bankName}
              onChangeText={text => setBankName(text)}
              keyboardType="default"
              placeholder="Bank Name"
            />
          </View>
        </View>

        {/* Beneficiary Account Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Beneficiary Account Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={beneficiaryAccountNumber}
              onChangeText={text => setBeneficiaryAccountNumber(text)}
              keyboardType="numeric"
              placeholder="Beneficiary Account Number"
            />
          </View>
        </View>

        {/* Select Account Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Account Type</Text>
          <Picker
            selectedValue={selectedValue}
            style={styles.dropdown}
            onValueChange={handleValueChange}>
            <Picker.Item label="Select Account Type" value="none" />
            <Picker.Item label="Savings Account" value="Savings" />
            <Picker.Item label="Current Account" value="Current" />
            <Picker.Item label="Checking Account" value="Checking" />
            <Picker.Item label="Fixed Account" value="Fixed" />
            <Picker.Item label="Non Resident Account" value="Non Resident" />
            <Picker.Item label="Online Banking" value="Online Banking" />
            <Picker.Item label="Domiciliary Account" value="Domiciliary" />
            <Picker.Item label="Joint Account" value="Joint" />
          </Picker>
        </View>

        {/* Text Box */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Narration/Purpose</Text>
          <TextInput
            style={styles.inputBox}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            placeholder="Fund Description"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={() => handleConfirm()}>
          <Ionicons name="exit-outline" size={24} color="white" style={styles.exitIcon} />
          <Text style={{ color: 'white', marginLeft: 2, fontSize: 15 }}>Transfer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: screenWidth * 0.9,
  },
  formGroup: {
    marginBottom: 50,
    width: '100%',
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  currencySymbol: {
    fontSize: 25,
    marginRight: 5,
    color: 'purple',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  inputBox: {
    height: 120,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top', // Align text to the top in multiline mode
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  exitIcon: {
    marginRight: 10,
  },
});
