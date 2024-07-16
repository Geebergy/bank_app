import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;

export default function Withdrawals() {
  const { userData, handleGetUser } = useUser();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('none');
  const [walletType, setWalletType] = useState('none');
  const [beneficiaryAccountName, setBeneficiaryAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [walletAddres, setWalletAddress] = useState('');


  const refreshData = async () =>{
    const userId = await AsyncStorage.getItem('userId');
    handleGetUser(userId);
  }

  useEffect(() => {
    refreshData();
  }, []);

  // reset form
  const resetForm = () => {
    setAmount('');
    setSelectedMethod('none');
    setWalletType('none');
    setBeneficiaryAccountName('');
    setBankName('');
    setBeneficiaryAccountNumber('');
    setRoutingNumber('');
    setWalletAddress('');
  };
  

  // 


  const handleMethodChange = (itemValue) =>{
    setSelectedMethod(itemValue);
  }
  
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
          text1: 'Insufficient Funds!',
          position: 'top'
        });
      }
      else{
        const userId = await AsyncStorage.getItem('userId');

    
  const userData = {
    reference_id: randomRef,
    user_id: userId,
    amount: amount,
    withdraw_method: walletType !== 'none' ? walletType : selectedMethod,
    trans_type: 1,
    wallet_address: walletAddres ? walletAddres : 'did not apply',
    bankname: bankName,
    account_number: beneficiaryAccountNumber ? beneficiaryAccountNumber : 'did not apply',
    routineno: routingNumber ? routingNumber : 'did not apply',
    acctname: beneficiaryAccountName ? beneficiaryAccountName : 'did not apply',
    status: 2,

};

    axios.post('http://192.168.140.241:3003/user/save_withdrawal', userData)
    .then(response => {
      Toast.show({
        type: 'success',
        text1: 'Withdrawal Successful',
        text2: 'Your transaction is being processed.',
        position: 'top'
      });
      resetForm(); // Reset form fields
      refreshData();
    })
    .catch(error => {
      console.error('Error with withdrawal:', error);
      Toast.show({
        type: 'error',
        text1: 'Withdrawal Failed!',
        text2: 'Check your details and try again',
        position: 'top'
      });
    });
    
      }
    }
};


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, textAlign: 'start', marginBottom: 40, fontWeight: '80' }}>Withdrawal</Text>


        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Withdrawal Method</Text>
          <Picker
            selectedValue={selectedMethod}
            style={styles.dropdown}
            onValueChange={handleMethodChange}>
            <Picker.Item label="Select Withdrawal Method" value="none" />
            <Picker.Item label="E-transfer" value="crypto" />
            <Picker.Item label="Bank withdrawal" value="bank" />
          </Picker>
        </View>



        {selectedMethod === 'crypto' && (
  <>
    {/* withdrawal type */}
    <View style={styles.formGroup}>
      <Text style={styles.label}>Withdrawal Type</Text>
      <Picker
        selectedValue={walletType}
        style={styles.dropdown}
        onValueChange={value => setWalletType(value)}>
        <Picker.Item label="Select Withdrawal Type" value="none" />
        <Picker.Item label="Paypal" value="pp" />
        <Picker.Item label="BTC" value="btc" />
        <Picker.Item label="USDT" value="usdt" />
        <Picker.Item label="ETH" value="eth" />
        <Picker.Item label="Revolut" value="revolut" />
        <Picker.Item label="Payoneer" value="payoneer" />
        <Picker.Item label="MBWAY" value="mbway" />
      </Picker>
    </View>

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
      <Text style={styles.label}>Email/ Wallet Address/MBWAY Phone number</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={walletAddres}
          onChangeText={text => setWalletAddress(text)}
          keyboardType="default"
          placeholder="Wallet Address"
        />
      </View>
    </View>
  </>
)}

{selectedMethod === 'bank' && (
  <>
  <Text style={{color: 'gray', fontSize: 14, marginBottom: 20}}>Name on bank must match Banker Banks.</Text>
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
          <Text style={styles.label}>Account Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={beneficiaryAccountNumber}
              onChangeText={text => setBeneficiaryAccountNumber(text)}
              keyboardType="numeric"
              placeholder="Account Number"
            />
          </View>
        </View>

        {/* user routing number */}
        {/* Beneficiary Account Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Routing Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={routingNumber}
              onChangeText={text => setRoutingNumber(text)}
              keyboardType="numeric"
              placeholder="Routing Number"
            />
          </View>
        </View>

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
  </>
)}
        


  

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
          <Ionicons name="exit-outline" size={24} color="white" style={styles.exitIcon} />
          <Text style={{ color: 'white', marginLeft: 2, fontSize: 15 }}>Withdraw Funds</Text>
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
