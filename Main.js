import React, {useState, useEffect, useCallback} from 'react';
import { Image, StatusBar, ActivityIndicator, Text, View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AccountManager from './screens/account_manager';
import Deposit from './screens/deposit';
import DomesticTransfer from './screens/d-transfer';
import WireTransfer from './screens/w-transer';
import VirtualCards from './screens/virtual-card';
import LoansAndMortgages from './screens/loans_and_mortgages';
import Withdrawals from './screens/withdrawal';
// subscreens
import AllTransactions from './screens/sub-screens/all-withdrawal-transactions';
import CreditDebitTransactions from './screens/sub-screens/credit-debit-transactions';
import WireTransaction from './screens/sub-screens/wire-transactions';
import DomesticTransactions from './screens/sub-screens/domestic-transactions';
import LoanTransactions from './screens/sub-screens/loan-transactions';
import { useUser } from './UserContext';
import axios from 'axios';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { state, navigation } = props;
  const { userData, handleGetUser } = useUser();
  const [expandedTransactions, setExpandedTransactions] = React.useState(false);
  


  const toggleTransactions = () => {
    setExpandedTransactions(!expandedTransactions);
  };

  
  


  return (
    <DrawerContentScrollView style={styles.drawer} {...props}>
      <View style={styles.drawerHeader}>
        {/* Your custom image */}
        {userData && userData.acct_imf ? (
               <Image source={{ uri: userData.acct_imf }} style={styles.profilePic} />
            ) : (
              <Image source={require('./assets/icons/person.png')} style={styles.profilePic} />
            )}
        {/* User info */}
        <View style={styles.userInfo}>
        {userData && userData.firstname && userData.lastname && (
          <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
        )}
        {userData && userData.acct_type && (
          <Text style={styles.accountType}>{userData.acct_type}</Text>
        )}
        {/* {userData && userData.acct_currency && (
          <Text style={styles.accountType}>{userData.acct_currency} Account</Text>
        )} */}
        </View>
      </View>
      {/* Menu Items */}
      {/* dashboard */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="home"
            color={state.index === 0 ? 'white' : color}
            size={size}
          />
        )}
        label="Dashboard"
        onPress={() => navigation.navigate('HomeStack')}
        style={{
          backgroundColor: state.index === 0 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 0 ? 'white' : 'black',
        }}
      />
      {/* deposit */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="logo-usd"
            color={state.index === 1 ? 'white' : color}
            size={size}
          />
        )}
        label="Online Deposit"
        onPress={() => navigation.navigate('DepositStack')}
        style={{
          backgroundColor: state.index === 1 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 1 ? 'white' : 'black',
        }}
      />
      {/* domestic transfer */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="arrow-forward"
            color={state.index === 2 ? 'white' : color}
            size={size}
          />
        )}
        label="Domestic Transfer"
        onPress={() => navigation.navigate('DomesticTransferStack')}
        style={{
          backgroundColor: state.index === 2 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 2 ? 'white' : 'black',
        }}
      />
      {/* wire transfer */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="wifi"
            color={state.index === 3 ? 'white' : color}
            size={size}
          />
        )}
        label="Wire Transfer"
        onPress={() => navigation.navigate('WireTransferStack')}
        style={{
          backgroundColor: state.index === 3 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 3 ? 'white' : 'black',
        }}
      />
      {/* virtual card */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="card"
            color={state.index === 4 ? 'white' : color}
            size={size}
          />
        )}
        label="Virtual Card"
        onPress={() => navigation.navigate('VirtualCardStack')}
        style={{
          backgroundColor: state.index === 4 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 4 ? 'white' : 'black',
        }}
      />
      {/* loan and mortgages */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="download"
            color={state.index === 5 ? 'white' : color}
            size={size}
          />
        )}
        label="Loan and Mortgages"
        onPress={() => navigation.navigate('LoansAndMortgagesStack')}
        style={{
          backgroundColor: state.index === 5 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 5 ? 'white' : 'black',
        }}
      />
  
      {/* Transactions Dropdown */}
      <DrawerItem
        label="Transactions"
        onPress={toggleTransactions}
        icon={({ color, size }) => (
          <Ionicons
              name={expandedTransactions ? 'chevron-down' : 'chevron-forward'}
              color={color}
              size={size}
            />
        )}
        labelStyle={{
          color: 'black',
        }}
      />
      {expandedTransactions && (
        <React.Fragment>
          {/* Each transaction type */}
          <DrawerItem
            label="Credit / Debit Transactions"
            onPress={() => {
              navigation.navigate('Credit-DebitStack');
              setExpandedTransactions(false);
            }}
            style={{
              backgroundColor:
                state.routes[state.index].name === 'Credit-DebitStack'
                  ? '#800080'
                  : null,
              marginLeft: 73,
              borderRadius: 10,
            }}
            labelStyle={{
              color:
                state.routes[state.index].name === 'Credit-DebitStack'
                  ? 'white'
                  : 'black',
            }}
          />
          {/* Add more DrawerItems for each type of transaction */}
          <DrawerItem
            label="Wire Transactions"
            onPress={() => {
              navigation.navigate('Wire-TransferStack');
              setExpandedTransactions(false);
            }}
            style={{
              backgroundColor:
                state.routes[state.index].name === 'Wire-TransferStack'
                  ? '#800080'
                  : null,
              marginLeft: 73,
              borderRadius: 10,
            }}
            labelStyle={{
              color:
                state.routes[state.index].name === 'Wire-TransferStack'
                  ? 'white'
                  : 'black',
            }}
          />
          {/*  */}
          <DrawerItem
            label="Domestic Transactions"
            onPress={() => {
              navigation.navigate('Domestic-TransactionsStack');
              setExpandedTransactions(false);
            }}
            style={{
              backgroundColor:
                state.routes[state.index].name === 'Domestic-TransactionsStack'
                  ? '#800080'
                  : null,
              marginLeft: 73,
              borderRadius: 10,
            }}
            labelStyle={{
              color:
                state.routes[state.index].name === 'Domestic-TransactionsStack'
                  ? 'white'
                  : 'black',
            }}
          />
          {/*  */}
          <DrawerItem
            label="Loan Transactions"
            onPress={() => {
              navigation.navigate('LoansStack');
              setExpandedTransactions(false);
            }}
            style={{
              backgroundColor:
                state.routes[state.index].name === 'LoansStack'
                  ? '#800080'
                  : null,
              marginLeft: 73,
              borderRadius: 10,
            }}
            labelStyle={{
              color: state.routes[state.index].name === 'LoansStack' ? 'white' : 'black',
            }}
          />
          {/*  */}
          <DrawerItem
            label="All Withdrawals"
            onPress={() => {
              navigation.navigate('AllWithdrawalsStack');
              setExpandedTransactions(false);
            }}
            style={{
              backgroundColor:
                state.routes[state.index].name === 'AllWithdrawalsStack'
                  ? '#800080'
                  : null,
              marginLeft: 73,
              borderRadius: 10,
            }}
            labelStyle={{
              color:
                state.routes[state.index].name === 'AllWithdrawalsStack'
                  ? 'white'
                  : 'black',
            }}
          />
        </React.Fragment>
      )}
      {/* withdrawal */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="logo-usd"
            color={state.index === 6 ? 'white' : color}
            size={size}
          />
        )}
        label="Withdrawal"
        onPress={() => navigation.navigate('WithdrawalStack')}
        style={{
          backgroundColor: state.index === 6 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 6 ? 'white' : 'black',
        }}
      />
      {/* account manager */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="person"
            color={state.index === 7 ? 'white' : color}
            size={size}
          />
        )}
        label="Account Manager"
        onPress={() => navigation.navigate('ProfileStack')}
        style={{
          backgroundColor: state.index === 7 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 7 ? 'white' : 'black',
        }}
      />
      {/* settings */}
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="settings"
            color={state.index === 8 ? 'white' : color}
            size={size}
          />
        )}
        label="Settings"
        onPress={() => navigation.navigate('SettingsStack')}
        style={{
          backgroundColor: state.index === 8 ? '#800080' : null,
          borderRadius: 10,
        }}
        labelStyle={{
          color: state.index === 8 ? 'white' : 'black',
        }}
      />
    </DrawerContentScrollView>
  );
}


  


function Main() {
  // header options default
  const headerOptions = useCallback((navigation) => ({
    headerStyle: {
      backgroundColor: 'purple',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerLeftContainerStyle: {
      marginLeft: 10,
    },
    headerRightContainerStyle: {
      marginRight: 10,
    },
    headerLeft: () => (
      <Ionicons
        name="menu"
        size={32}
        color="white"
        onPress={() => navigation.toggleDrawer()}
        style={{ marginLeft: 10 }}
      />
    ),
    headerTitle: '',
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="white"
          onPress={openModal}
          style={{ marginRight: 30 }}
        />
        <Ionicons
          name="settings-outline"
          size={24}
          color="white"
          onPress={() => navigation.navigate('SettingsStack')}
          style={{ marginRight: 10 }}
        />
      </View>
    ),
  }), []);


 // Function components for the different stack navigators
 const HomeStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
), [headerOptions]);

const DepositStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Deposit" component={Deposit} />
  </Stack.Navigator>
), [headerOptions]);

const DomesticTranferStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="DomesticTransfer" component={DomesticTransfer} />
  </Stack.Navigator>
), [headerOptions]);

const WireTransferStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="WireTransfer" component={WireTransfer} />
  </Stack.Navigator>
), [headerOptions]);

const VirtualCardStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="VirtualCard" component={VirtualCards} />
  </Stack.Navigator>
), [headerOptions]);

const LoansAndMortgagesStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="LoansandMortgages" component={LoansAndMortgages} />
  </Stack.Navigator>
), [headerOptions]);

const WithdrawalStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Withdrawal" component={Withdrawals} />
  </Stack.Navigator>
), [headerOptions]);

const SettingsStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Settings" component={AccountManager} />
  </Stack.Navigator>
), [headerOptions]);

const ProfilesStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
), [headerOptions]);

const CreditStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Credit-Debit" component={CreditDebitTransactions} />
  </Stack.Navigator>
), [headerOptions]);

const WireStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Wire-Transfer" component={WireTransaction} />
  </Stack.Navigator>
), [headerOptions]);

const DomesticStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Domestic-Transactions" component={DomesticTransactions} />
  </Stack.Navigator>
), [headerOptions]);

const LoanStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="Loans" component={LoanTransactions} />
  </Stack.Navigator>
), [headerOptions]);

const AllWithdrawalsStackNavigator = useCallback(({ navigation }) => (
  <Stack.Navigator screenOptions={() => headerOptions(navigation)}>
    <Stack.Screen name="AllWithdrawals" component={AllTransactions} />
  </Stack.Navigator>
), [headerOptions]);

const DrawerNavigator = useCallback(() => (
  <Drawer.Navigator initialRouteName="HomeStack" drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="HomeStack" component={HomeStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="DepositStack" component={DepositStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="DomesticTransferStack" component={DomesticTranferStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="WireTransferStack" component={WireTransferStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="VirtualCardStack" component={VirtualCardStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="LoansAndMortgagesStack" component={LoansAndMortgagesStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="WithdrawalStack" component={WithdrawalStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="ProfileStack" component={ProfilesStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="SettingsStack" component={SettingsStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="Credit-DebitStack" component={CreditStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="Wire-TransferStack" component={WireStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="Domestic-TransactionsStack" component={DomesticStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="LoansStack" component={LoanStackNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="AllWithdrawalsStack" component={AllWithdrawalsStackNavigator} options={{ headerShown: false }} />
  </Drawer.Navigator>
), [headerOptions]);
const [modalVisible, setModalVisible] = useState(false);
const [transactions, setTransactions] = useState(null);
const [loading, setLoading] = useState(true);

const fetchTransactions = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      const response = await axios.get(`https://bank-app-4f6l.onrender.com/user/getLoansByUserId/${userId}`);
      const transactions = response.data;
      if (transactions.length > 0) {
        transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const mostRecentTransaction = transactions[0];
        setTransactions([mostRecentTransaction]);
      } else {
        setTransactions([]);
      }
    } else {
      console.error('User ID not found in AsyncStorage');
      setTransactions([]);
    }
  } catch (error) {
    console.error('Error fetching withdrawal data:', error);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
};

const refreshData = async () =>{
  const userId = await AsyncStorage.getItem('userId');
  handleGetUser(userId);
};

useEffect(() => {
  refreshData();
}, []);

useEffect(() => {
  fetchTransactions();
}, []);

const openModal = () => {
  setModalVisible(true);
};

const closeModal = () => {
  setModalVisible(false);
};

const MyModal = () => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={closeModal}
  >
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Ionicons name="close" size={18} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : transactions !== null && transactions.length > 0 ? (
          <Text style={styles.amountText}>
              <Text style={styles.pendingText}>Pending Loan: </Text>
              <Text style={styles.amount}>${transactions[0].amount}</Text>
            </Text>
        ) : (
          <Text style={styles.noneText}>No pending loans</Text>
        )}
      </View>
    </View>
  </Modal>
);
  return (
      <>
      <MyModal />
      <DrawerNavigator />
      </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#FFFFFF'
  },
  drawerHeader: {
    backgroundColor: '#800080', // Purple background for the header
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    // borderWidth: 2,
    // borderColor: 'white',
    resizeMode: 'contain'
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  accountType: {
    fontSize: 14,
    color: 'white',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: 170,
    height: 80,
    borderRadius: 10,
    position: 'absolute',
    right: 70,
    top: 60,
    borderWidth: 2,
    borderColor: 'gray',
    padding: 10
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'purple',
    padding: 2,
    borderRadius: 10,
  },
  amountText: {
    // fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pendingText: {
    // fontSize: 18,
    fontWeight: 'bold',
    color: 'gray', // Example style for "Pending Loan:"
  },
  amount: {
    // fontSize: 12,
    fontWeight: 'bold',
    color: 'red', // Example style for amount
  },
  noneText: {
    fontSize: 18,
    color: 'red',
  },
});

export default Main;
