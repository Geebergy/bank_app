import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Section1 = ({ userData, updateUserData, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCurrenciesAndCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const data = response.data;

        const currencies = [];
        const countries = [];

        data.forEach(country => {
          if (country.currencies) {
            Object.keys(country.currencies).forEach(currencyCode => {
              if (!currencies.some(c => c.value === currencyCode)) {
                currencies.push({ label: currencyCode, value: currencyCode });
              }
            });
          }

          if (country.name && country.name.common) {
            countries.push({ label: country.name.common, value: country.name.common }); // Use full name for label and value
          }
        });

        // Sort the arrays alphabetically
        currencies.sort((a, b) => a.label.localeCompare(b.label));
        countries.sort((a, b) => a.label.localeCompare(b.label));

        setCurrencies(currencies);
        setCountries(countries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCurrenciesAndCountries();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const accountTypes = [
    { label: 'Select account type', value: 'none' },
    { label: 'Savings', value: 'savings' },
    { label: 'Current', value: 'current' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Personal Info</Text>

        {/* Form Fields */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userData.firstname}
          onChangeText={(text) => updateUserData('firstname', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userData.lastname}
          onChangeText={(text) => updateUserData('lastname', text)}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select a Currency</Text>
        <Picker
          selectedValue={userData.acct_currency}
          onValueChange={(itemValue) => updateUserData('acct_currency', itemValue)}
          style={styles.input}
        >
          {currencies.map((currency) => (
            <Picker.Item key={currency.value} label={currency.label} value={currency.value} />
          ))}
        </Picker>

        <Picker
          selectedValue={userData.acct_type}
          onValueChange={(itemValue) => updateUserData('acct_type', itemValue)}
          style={styles.input}
        >
          {accountTypes.map((type) => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Occupation"
          value={userData.acct_occupation}
          onChangeText={(text) => updateUserData('acct_occupation', text)}
        />

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Select a Country</Text>
        <Picker
          selectedValue={userData.country}
          onValueChange={(itemValue) => updateUserData('country', itemValue)} // Update to use itemValue directly
          style={styles.input}
        >
          {countries.map((country) => (
            <Picker.Item key={country.value} label={country.label} value={country.value} />
          ))}
        </Picker>
      </View>

      {/* Already have an account? */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
        <View>
          <Text style={{ color: 'purple', textAlign: 'right', marginTop: 50 }}>Already have an account?</Text>
        </View>
      </TouchableOpacity>
      {/* End of account enquiry */}
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
});

export default Section1;
