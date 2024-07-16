import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, Image, FlatList, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Rect, Text as SvgText, Circle, Pattern } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useUser } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreditDebitTransactions from './sub-screens/credit-debit-transactions';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { userData, handleGetUser } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState();



  const refreshData = async () =>{
    const userId = await AsyncStorage.getItem('userId');
    handleGetUser(userId);
  };

  useEffect(() => {
    refreshData();
  }, []);



  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View>
          <Svg width={screenWidth} height={(screenWidth / 200) * 130} viewBox="0 0 200 130">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#800080" stopOpacity="1" />
                <Stop offset="1" stopColor="#4B0082" stopOpacity="1" />
              </LinearGradient>
              <Pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <Circle cx="5" cy="5" r="3" fill="#555" />
              </Pattern>
            </Defs>

            <Rect x="10" y="10" width="180" height="110" rx="15" ry="15" fill="url(#grad)" />
            
            <View style={styles.profileContainer}>
            {userData && userData.acct_imf ? (
               <Image source={{ uri: userData.acct_imf }} style={styles.profilePic} />
            ) : (
              <Image source={require('../assets/icons/person.png')} style={styles.profilePic} />
            )}
            <Ionicons name="add" size={30} color="green" style={styles.plusIcon} />
           </View>

            
            {userData && userData.acct_balance !== null && (
              <View style={styles.spaceBetween}>
              <Text style={styles.balance}>Balance:</Text>
              <Text style={styles.mainBalance}>${userData.acct_balance.toFixed(2)}</Text>
              </View>
            )} 

            

            {userData && userData.acct_username && (
              <SvgText x="20" y="80" fontFamily="Arial" fontSize="10" fill="white" textAnchor="start">
                {userData.acct_username}
              </SvgText>
            )}
          </Svg>
        </View>

        <View style={styles.additionalBoxes}>
          <View style={styles.box}>
            <View style={styles.flexBox}>
              <Text>Pending</Text>
              <Ionicons name="chevron-up" size={30} color="green" style={{ marginLeft: 5 }} />
            </View>
            <View style={styles.innerBox}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>$0.00</Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.flexBox}>
              <Text>My Loan</Text>
              <Ionicons name="chevron-down" size={30} color="red" style={{ marginLeft: 5 }} />
            </View>
            <View style={styles.innerBox}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>$0.00</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.activeBtn]}>
          {userData && userData.acct_status && (
            <Text>{userData.acct_status}</Text>
          )}
          
        </TouchableOpacity>

        {userData && userData.acct_limit && (
           <View style={[styles.flexBox, styles.between]}>
             <Text style={{ color: 'gray' }}>Account Limit:</Text>
             <Text>${userData.acct_limit}</Text>
           </View>
        )}
            
        
        <View style={[styles.flexBox, styles.between]}>
          <Text style={{ color: 'gray' }}>Last Login IP:</Text>
          <Text>192.0.2.1</Text>
        </View>
        <View style={[styles.flexBox, styles.between]}>
          <Text style={{ color: 'gray' }}>Last Login Date:</Text>
         
          {userData && userData.createdAt && (
               <Text>{userData.createdAt}</Text>
          )}
        </View>
        
        <TouchableOpacity style={[styles.wireButton, styles.wireBtn]}>
          <Text>Wire Transfer</Text>
        </TouchableOpacity>

      </View>
        
      <View style={styles.tableContainer}>
      <CreditDebitTransactions />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'start',
    backgroundColor: '#fff',
  },
  container: {
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 40,
    left: 40,
  },
  profilePic: {
    width: 55,
    height: 55,
    borderRadius: 50,
    // borderWidth: 2,
    // borderColor: 'white',
    resizeMode: 'contain'
  },
  plusIcon: {
    backgroundColor: 'white',
    borderRadius: 12,
    top: -13,
    left: 225,
  },
  spaceBetween: {
    flexDirection: 'row',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '90%',
    marginBottom: 10,
    top: 90,
    margin: 'auto',
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
  },
  balance: {
    color: 'white',
    fontSize: 20,
  },
  mainBalance: {
    color: 'white',
    fontSize: 30,
  },
  additionalBoxes: {
    flexDirection: 'row',
    marginTop: -78,
  },
  box: {
    width: screenWidth * 0.4,
    height: 95,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBox: {
    width: screenWidth * 0.2,
    height: 45,
    backgroundColor: '#ccc',
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 70,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ffcc',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  activeBtn: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  wireButton: {
    width: 110,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80ffe6',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    top: 40,
  },
  wireBtn: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  between: {
    top: 28,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '80%',
  },
  tableContainer: {
    marginTop: 40,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    padding: 10,
    fontSize: 15,
    textAlign: 'center',
    color: 'purple',
  },
  table: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffff',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexWrap: 'wrap', // Allow wrapping of items
  },
  cell: {
    flexBasis: '50%', // Adjust the width as per your requirement
    padding: 10,
    textAlign: 'center',
  },
});
