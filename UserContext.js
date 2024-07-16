import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userCardData, setUserCardData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    initializeUserId();
  }, []); // Empty dependency array ensures this runs once on component mount

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://bank-app-4f6l.onrender.com/user/getUserData/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error retrieving user:', error);
        // Alert.alert('Error', 'Failed to retrieve user');
      }
    };

    const fetchUserCardData = async () => {
      try {
        const response = await axios.get(`https://bank-app-4f6l.onrender.com/user/getUserCardData/${userId}`);
        setUserCardData(response.data);
      } catch (error) {
        console.error('Error retrieving user card data:', error);
        // Alert.alert('Error', 'Failed to retrieve user card data');
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserCardData();
    }
  }, [userId]); // Runs whenever userId changes

  const handleGetUser = async (userId) => {
    try {
      const response = await axios.get(`https://bank-app-4f6l.onrender.com/user/getUserData/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error retrieving user:', error);
      // Alert.alert('Error', 'Failed to retrieve user');
    }
  };
  const handleGetUserCardData = async (userId) => {
    try {
      const response = await axios.get(`https://bank-app-4f6l.onrender.com/user/getUserCardData/${userId}`);
      setUserCardData(response.data);
    } catch (error) {
      console.error('Error retrieving user:', error);
      // Alert.alert('Error', 'Failed to retrieve user');
    }
  };

  const updateUser = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <UserContext.Provider value={{ userData, userCardData, updateUser, handleGetUser, handleGetUserCardData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
