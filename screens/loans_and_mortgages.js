import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;

export default function LoansAndMortgages() {
  const { userData, handleGetUser } = useUser();
  const [amount, setAmount] = useState('');
  const [customerText, setCustomerText] = useState('Customer Service');
  const [text, setText] = useState('');

  const refreshData = async () =>{
    const userId = await AsyncStorage.getItem('userId');
    handleGetUser(userId);
  }

  useEffect(() => {
    refreshData();
  }, []);

  const resetForm = () => {
    setAmount('');
    setCustomerText('Customer Service');
    setText('');
  };
  

  function generateRandomReference() {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomString = Math.random().toString(36).substr(2, 8); // Random alphanumeric string
  
    return `REF-${timestamp}-${randomString}`;
  }
  
  // Example usage
  const randomRef = generateRandomReference();

  const handleConfirm = async () => {
    console.log('ell')
    const userId = await AsyncStorage.getItem('userId');

    
  const userData = {
    loan_reference_id: randomRef,
    acct_id: userId,
    amount: amount,
    loan_remarks: text,
    loan_status: 2,
    loan_message: 'none',
};

    axios.post('http://192.168.140.241:3003/user/save_loan', userData)
    .then(response => {
      Toast.show({
        type: 'success',
        text1: 'Loan Request Successful',
        text2: 'Your request is being processed.',
        position: 'top'
      });
      resetForm(); // Reset form fields
      refreshData();
    })
    .catch(error => {
      console.error('Error with loan request:', error);
      Toast.show({
        type: 'error',
        text1: 'Request Failed!',
        text2: 'Check your details and try again',
        position: 'top'
      });
    });
    
};
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 40, fontWeight: '100' }}>Loan/Mortgages Application</Text>

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

        <View style={styles.formGroup}>
        <Text style={styles.label}>Receiver (Customer Care)</Text>
        <View>
          <TextInput
            style={styles.readOnlyInput}
            value={customerText}
            editable={false}
          />
        </View>
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
        <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
          <Ionicons name="exit-outline" size={24} color="white" style={styles.exitIcon} />
          <Text style={{ color: 'white', marginLeft: 1, fontSize: 15 }}>Submit</Text>
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
    marginBottom: 12,
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
  readOnlyInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
});
