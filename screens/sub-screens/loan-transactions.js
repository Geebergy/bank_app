import { View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
export default function LoanTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const userId = await AsyncStorage.getItem('userId');
    await axios.get(`http://192.168.140.241:3003/user/getLoansByUserId/${userId}`)
      .then(response => {
        setTransactions(response.data); // Correctly access the response data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching withdrawal data:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { minWidth: 50 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { minWidth: 100 }]}>{item.amount}</Text>
      <Text style={[styles.cell, { minWidth: 80 }]}>{item.type}</Text>
      <Text style={[styles.cell, { minWidth: 150 }]}>{item.senderReceiver}</Text>
      <Text style={[styles.cell, { minWidth: 200 }]}>{item.loan_remarks}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{item.created_at}</Text>
      <Text style={[styles.cell, { minWidth: 100 }]}>{item.timeCreated}</Text>
      <Text style={[styles.cell, { minWidth: 100 }]}>{item.loan_status}</Text>
    </View>
  );
  return (
    <View style={styles.scrollContainer}>
      <SafeAreaView style={styles.tableContainer}>
    <ScrollView horizontal>
      <View style={[styles.table, { minWidth: screenWidth }]}>
        <Text style={{ fontSize: 20, width: 150, marginBottom: 15 }}>Loan Transactions</Text>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { minWidth: 50 }]}>S/N</Text>
            <Text style={[styles.headerCell, { minWidth: 100 }]}>Amount</Text>
            <Text style={[styles.headerCell, { minWidth: 80 }]}>Type</Text>
            <Text style={[styles.headerCell, { minWidth: 150 }]}>Sender/Receiver</Text>
            <Text style={[styles.headerCell, { minWidth: 200 }]}>Description</Text>
            <Text style={[styles.headerCell, { minWidth: 120 }]}>Created At</Text>
            <Text style={[styles.headerCell, { minWidth: 100 }]}>Time Created</Text>
            <Text style={[styles.headerCell, { minWidth: 100 }]}>Status</Text>
          </View>
        </View>
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ minWidth: screenWidth }}
        />
      </View>
    </ScrollView>
  </SafeAreaView>
    </View>
  )
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

  tableContainer: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 40,
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
