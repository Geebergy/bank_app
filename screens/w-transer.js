import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;
export default function WireTransfer() {
  const [amount, setAmount] = useState('');
  const { userData, handleGetUser } = useUser();
  const [selectedValue, setSelectedValue] = useState('none');
  const [beneficiaryAccountName, setBeneficiaryAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [text, setText] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [country, setCountry] = useState('none');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);

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
    setSelectedValue('none');
    setBeneficiaryAccountName('');
    setBankName('');
    setBeneficiaryAccountNumber('');
    setText('');
    setSwiftCode('');
    setRoutingNumber('');
    setCountry('none');
    setCountries([]);
  };
  
  // handle confirm
  function generateRandomReference() {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomString = Math.random().toString(36).substr(2, 8); // Random alphanumeric string
  
    return `REF-${timestamp}-${randomString}`;
  }
  
  // Example usage
  const randomRef = generateRandomReference();

  const handleConfirm = async () => {
    setLoadingPage(true);
    if(userData && userData.acct_balance){
      if (amount > userData.acct_balance){
        Toast.show({
          type: 'error',
          text1: 'Insufficient Funds!',
          position: 'top'
        });
        setLoadingPage(false);
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
    trans_type: 'wire-transfer',
    acct_type: selectedValue,
    acct_country: country,
    acct_swift: swiftCode,
    acct_routing: routingNumber,
    acct_remarks: text,

};

    axios.post('https://bank-app-4f6l.onrender.com/user/wire_transfer', userData)
    .then(response => {
      Toast.show({
        type: 'success',
        text1: 'Transaction Successful',
        position: 'top'
      });
      resetForm(); // Reset form fields
      refreshData();
      setLoadingPage(false);
    })
    .catch(error => {
      console.error('Error with wire transfer:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to process transfer!',
        text2: 'Please check your details and try again',
        position: 'top'
      });
      setLoadingPage(false);
    });
    
      }
    }
};


  // end of confirm


  const handleCountryChange = (itemValue) => {
    setCountry(itemValue);
  };

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryData = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2
        }));
        setCountries(countryData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setLoading(false);
      });
  }, []);

  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 40, fontWeight: '100' }}>Wire Transfer</Text>

        {loadingPage ? (
          <ActivityIndicator />
        ):
        (
          <>
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

        {/* select country */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Country</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={country}
              style={styles.dropdown}
              onValueChange={handleCountryChange}>
              <Picker.Item label="Select Country" value="none" />
              {countries.map(country => (
                <Picker.Item key={country.code} label={country.name} value={country.code} />
              ))}
            </Picker>
          )}
        </View>

        {/* Swift Code */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Swift Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={swiftCode}
              onChangeText={text => setSwiftCode(text)}
              keyboardType="default"
              placeholder="Swift Code"
            />
          </View>
        </View>

        {/* Routing Number */}
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
          </>
        )}
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
