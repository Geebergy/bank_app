import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const VtuScreen = () => {
  const [networkId, setNetworkId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [planId, setPlanId] = useState('');
  
  const networkOptions = [
    { id: 'mtn', label: 'MTN' },
    { id: 'airtel', label: 'AIRTEL' },
    // Add more network options here
  ];

  const planOptions = [
    { id: '306', label: '	₦550	2.0 GB  (Airtel) - 30 days', networkID: 'airtel' },
    { id: '286', label: '₦526	2.0 GB (MTN) - 30 days', networkID: 'mtn' },
    // Add more plan options here
  ];

  const handleSubmit = () => {
    // var data = '{"network":network_id,\r\n"mobile_number": "09095263835",\r\n"plan": plan_id,\r\n"Ported_number":true\r\n}';
    const data = JSON.stringify({
      network: networkId,
      mobile_number: mobileNumber,
      plan: planId,
      Ported_number: true
    });
    // use data for subscription
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://www.maskawasub.com/api/data/',
      headers: { 
        'Authorization': 'e344e3026d3d1f39f9ba0e5cfd44e75097ad8d8e', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  };


  // Filter plan options based on selected networkId
  const filteredPlanOptions = planOptions.filter(plan => plan.networkID === networkId);



  
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={networkId}
        onValueChange={(itemValue) => setNetworkId(itemValue)}
        style={styles.picker}
      >
        {networkOptions.map((option) => (
          <Picker.Item key={option.id} label={option.label} value={option.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <Picker
        selectedValue={planId}
        onValueChange={(itemValue) => setPlanId(itemValue)}
        style={styles.picker}
      >
        {filteredPlanOptions.map((option) => (
          <Picker.Item key={option.id} label={option.label} value={option.id} />
        ))}
      </Picker>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});

export default VtuScreen;
