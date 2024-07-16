import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const screenWidth = Dimensions.get('window').width;



export default function AccountManager({navigation}) {
    const { userData, handleGetUser } = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(userData.acct_phone || '');
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    const refreshData = async () =>{
      const userId = await AsyncStorage.getItem('userId');
      handleGetUser(userId);
    }
  
    useEffect(() => {
      refreshData();
    }, []);
  
    const openModal = () => {
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };

    const { navigate } = useNavigation();
    const logOut = async() =>{
      await AsyncStorage.removeItem('userId');
      Toast.show({
        type: 'success',
        text1: 'Signed out successfully',
        position: 'top'
    });
      navigate('LoginForm');
    }
  
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
  
    const handleUpdate = async () => {
      const userId = await AsyncStorage.getItem('userId');
      try {
        const userInfo = {
          image: imageUri,
          phone: phoneNumber,
          userId: userId
        }
        let formData = new FormData();
        formData.append('image', imageUri)
        formData.append('phone', phoneNumber);
        formData.append('userId', userId);
  
        let response = await fetch('https://bank-app-4f6l.onrender.com/user/update-profile', {
          method: 'POST',
          body: userInfo,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.ok) {
          Toast.show({
            type: 'success',
            text1: 'Account Updated Successfully',
            position: 'top'
          });
          refreshData();; // Refresh user data
          closeModal();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to update account',
            text2: 'Something went wrong. Please try again.',
            position: 'top'
          });
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Failed to update account',
          text2: 'Something went wrong. Please try again.',
          position: 'top'
        });
      }
    };
    const handlePhoneNumberChange = (text) => {
        // You can directly set the phoneNumber state here, if needed
        setPhoneNumber(text);
    };
  
    const MyModal = () => {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Update Profile</Text>
              <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Picture</Text>
              </TouchableOpacity>
              {uploading ? (
                <ActivityIndicator />
              ):
              (
                <>{imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}</>
              )}
              <TextInput
                style={styles.input}
                defaultValue={phoneNumber}
                // onChangeText={setPhoneNumber}
                onEndEditing={(event) => handlePhoneNumberChange(event.nativeEvent.text)}
                keyboardType="phone-pad"
                placeholder="Enter new phone number"
               autoFocus={true} // Automatically focuses on this input when modal opens
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                <Text style={styles.submitButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <MyModal />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.profileTitle}>{userData?.firstname}'s Profile</Text>
          <TouchableOpacity style={styles.pencil} onPress={openModal}>
            <Ionicons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 40, marginHorizontal: 'auto' }}>
            {userData && userData.acct_imf ? (
               <Image source={{ uri: userData.acct_imf }} style={{width: 140, height: 140, marginTop: 50, borderRadius: 70}} />
            ) : (
              <Image source={require('../assets/icons/person.png')} style={{width: 140, height: 140, marginTop: 50, borderRadius: 70}} />
            )}
          {userData?.firstname && userData?.lastname && (
            <Text style={{ fontSize: 20, color: 'purple', marginHorizontal: 'auto', marginTop: 12 }}>{userData.firstname} {userData.lastname}</Text>
          )}
        </View>
        <View style={styles.spaceBetween}>
          <Ionicons name="star" size={30} color="purple" />
          <Text style={{ marginLeft: 20 }}>{userData.acct_type}</Text>
        </View>
        <View style={styles.spaceBetween}>
          <Ionicons name="calendar" size={30} color="purple" />
          <Text style={{ marginLeft: 20 }}>{userData.createdAt}</Text>
        </View>
        <View style={styles.spaceBetween}>
          <Ionicons name="location" size={30} color="purple" />
          <Text style={{ marginLeft: 20 }}>192.0.2.1</Text>
        </View>
        <View style={styles.spaceBetween}>
          <Ionicons name="call" size={30} color="purple" />
          <Text style={{ marginLeft: 20 }}>{userData.acct_phone}</Text>
        </View>

        <TouchableOpacity style={styles.logOut} onPress={logOut}>
          <Text style={{color: 'white', marginRight: 10}}>Log out</Text>
          <Ionicons name="exit-outline" size={24} color="white" style={styles.exitIcon} />
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
      flexDirection: 'row',
      justifyContent: 'start',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 15,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 35,
      alignItems: 'center',
      elevation: 5,
    },
    closeButton: {
      alignSelf: 'flex-end',
      backgroundColor: 'purple',
      padding: 5,
      borderRadius: 10,
    },
    modalText: {
      marginTop: 20,
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
    uploadButton: {
      backgroundColor: 'purple',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    uploadButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    imagePreview: {
      width: 100,
      height: 100,
      marginBottom: 20,
      borderRadius: 10,
    },
    input: {
      width: '100%',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: 'purple',
      padding: 10,
      borderRadius: 10,
    },
    submitButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    pencil: {
      borderRadius: 50,
      backgroundColor: 'purple',
      position: 'absolute',
      right: 10,
      top: 10,
      padding: 10,
    },
    logOut: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderRadius: 50,
      bottom: 10,
      marginLeft: '40%',
      width: 110,
      backgroundColor: 'purple',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      color: 'white',
      textAlign: 'center',
      alignItems: 'center',
    },
  });