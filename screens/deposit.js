import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, TextInput, TouchableOpacity, StyleSheet, Clipboard, Image, Button, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const screenWidth = Dimensions.get('window').width;
import Toast from 'react-native-toast-message';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useUser } from '../UserContext';

export default function Deposit() {
    const { userData, handleGetUser } = useUser();
    const [amount, setAmount] = useState('');
    const [selectedValue, setSelectedValue] = useState('none');
    const [copiedText, setCopiedText] = useState('Select a crypto type');
    const [imageUri, setImageUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState(null);
    const [loadingPage, setLoadingPage] = useState(false);

    const refreshData = async () =>{
      const userId = await AsyncStorage.getItem('userId');
      handleGetUser(userId);
    }
  
    useEffect(() => {
      refreshData();
    }, []);

    const resetForm = () => {
      setAmount('');
      setSelectedValue('none');
      setCopiedText('Select a crypto type');
      setImageUri('');
      setUploading(false);
    };
    


    // HANDLE IMAGE UPLOAD
    const handleImagePick = async () => {
      const userId = await AsyncStorage.getItem('userId');
    
      try {
        const imageResponse = await ImagePicker.launchImageLibraryAsync({
          mediaType: 'photo'
        });
    
    
        if (!imageResponse || !imageResponse.assets || imageResponse.assets.length === 0 || !imageResponse.assets[0].uri) {
          console.error('No valid image selected');
          return;
        }
    
        const imageFile = imageResponse.assets[0].uri;
    
        // Upload file to Firebase Storage
        setUploading(true);
    
        try {
          const { uri } = await FileSystem.getInfoAsync(imageFile);
    
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
              resolve(xhr.response);
            };
            xhr.onerror = (e) => {
              reject(new TypeError('Network Request Failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null); // Ensure to send the request
          });
          
          const filename = imageFile.substring(imageFile.lastIndexOf('/') + 1);
          const storageRef = ref(storage, `images/${filename}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);
    
          uploadTask.on('state_changed', 
            (snapshot) => {
              // Handle progress, if needed
            },
            (error) => {
              console.error('Error uploading image:', error);
              setUploading(false);
            },
            () => {
              // Upload completed successfully, get download URL
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  setImageUri(downloadURL); // Set the image URL for display
                  setUploading(false);
                })
                .catch((error) => {
                  console.error('Error getting download URL:', error);
                  setUploading(false);
                });
            }
          );
    
        } catch (error) {
          console.error('Error fetching file info or creating blob:', error);
          setUploading(false);
        }
    
      } catch (error) {
        console.error('Error picking image:', error);
      }
    };
  
    
    

    // handle submit

    function generateRandomReference() {
      const timestamp = Date.now().toString(); // Current timestamp
      const randomString = Math.random().toString(36).substr(2, 8); // Random alphanumeric string
    
      return `REF-${timestamp}-${randomString}`;
    }
    
    // Example usage
    const randomRef = generateRandomReference();

    
  
    const handleConfirm = async () => {
      setLoadingPage(true);
      const userId = await AsyncStorage.getItem('userId');
      const userData = {
          user_id: userId,
         reference_id: randomRef,
         image: imageUri,
         amount: amount,
         wallet_address: selectedValue,
          crypto_id: 1,
         crypto_status: 2
      };
      // data save logic
  
      axios.post('https://bank-app-4f6l.onrender.com/user/addDeposit', userData)
      .then(response => {
        Toast.show({
          type: 'success',
          text1: 'Transfer Successful',
          position: 'top'
        });
        resetForm(); // Reset form fields
        refreshData();
        setLoadingPage(false);
      })
      .catch(error => {
        console.error('Error with domestic transfer:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to complete transfer',
          text2: 'Please confirm your details and try again',
          position: 'top'
        });
        setLoadingPage(false);
      });
      
  };


  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const userId = await AsyncStorage.getItem('userId');
    await axios.get(`https://bank-app-4f6l.onrender.com/user/getWalletAddress/${userId}`)
      .then(response => {
        setWalletAddress(response.data); // Correctly access the response data
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

  
    const handleCopyText = () => {
      if(selectedValue === 'none'){
      }
      else{
        Clipboard.setString(copiedText);
        // Optionally, you can display a message or toast to inform the user that the text has been copied
      }
   
    };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
      {loadingPage ? (
        <ActivityIndicator />
      ):
      (
        <>
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
        <Text style={styles.label}>Crypto Type</Text>
        <Picker
        selectedValue={selectedValue}
        style={styles.dropdown}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedValue(itemValue);
         setCopiedText(itemValue); // Set the copied text when the value changes
       }}
      >
        <Picker.Item label="Select" value="none" />
        {walletAddress.map((item) => (
          <Picker.Item
           key={item.id}
           label={item.crypto_name}
           value={item.wallet_address}
         />
        ))}
      </Picker>
      </View>

      

      <View style={styles.formGroup}>
        <Text style={styles.label}>Read-only with Copy Button</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.readOnlyInput}
            value={copiedText}
            editable={false}
          />
          <TouchableOpacity onPress={handleCopyText} style={styles.copyButton}>
            <Text style={{marginRight: 7, fontSize: 15}}>Copy</Text>
            <Ionicons name="copy" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
      
      {uploading ? (
       <ActivityIndicator/>
      ) : (
        <>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 10 }} />
          ) : (
            <Image source={require('../assets/icons/pic-icon-3d-purple.png')} style={styles.profilePic} />
          )}
        </>
      )}

       
    </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
      <Ionicons name="exit-outline" size={24} color="white" style={styles.exitIcon} />
      <Text style={{color: 'white', marginLeft: 10}}>Crypto Deposit</Text>
    </TouchableOpacity>
        </>
      )}
    </View>

    </ScrollView>
  )
}
const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'start',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 1, // Border width
      borderColor: '#ccc', // Border color (gray)
      borderRadius: 10, // Border radius for rounded corners (optional)
      padding: 20, // Padding inside the container (optional)
      margin: 20,
      width: screenWidth * 0.9,
    },
    formGroup: {
        marginBottom: 50,
        width: screenWidth * 0.7,
      },
      label: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: screenWidth * 0.7,
      },
      currencySymbol: {
        fontSize: 25,
        marginRight: 5,
        color: 'purple',
      },
      input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        width: screenWidth * 0.7,
      },
      dropdown: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
      },
      uploadButton: {
        backgroundColor: 'purple',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 8,
      },
      uploadButtonText: {
        color: '#fff',
        fontSize: 16,
      },
      uploadedImage: {
        width: 150,
        height: 150,
        marginTop: 20,
        left: 40,
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
      copyButton: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: 'purple',
        
      },
      submitButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 50,
        backgroundColor: 'purple',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
      },
  });