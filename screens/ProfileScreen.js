import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image,  TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;
export default function ProfileScreen() {
    const { userData, handleGetUser } = useUser();
    const refreshData = async () =>{
      const userId = await AsyncStorage.getItem('userId');
      handleGetUser(userId);
    }
  
    useEffect(() => {
      refreshData();
    }, []);


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{fontSize: 20}}>Personal Account Manager</Text>
        <View style={{alignItems: 'center', marginBottom: 40}}>
        <Image source={require('../assets/icons/person.png')} style={{ width: 140, height: 140}} />
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Manager</Text>
            <Text style={{fontSize: 20,}}>{userData.mgr_name}</Text>
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Manager Contact</Text>
            <Text style={{fontSize: 20,}}>{userData.mgr_no}</Text>
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Manager Email</Text>
            <Text style={{fontSize: 20,}}>{userData.mgr_email}</Text>
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Creation</Text>
            <Text style={{fontSize: 20,}}>{userData.createdAt}</Text>
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Type</Text>
            <Text style={{fontSize: 20,}}>{userData.acct_type}</Text>
        </View>

        <View style={styles.spaceBetween}>
            <Text style={{color: 'gray'}}>Account Limits</Text>
            <Text style={{fontSize: 20,}}>${userData.acct_limit}</Text>
        </View>
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
    justifyContent: 'start',
    alignItems: 'start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    marginBottom: 10,
    width: screenWidth * 0.9,
  },
  spaceBetween: {
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    alignItems: 'start',
    paddingHorizontal: 20,
    marginBottom: 30, // Adjust spacing between each pair of items
},

});