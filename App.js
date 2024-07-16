import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { UserProvider } from './UserContext';
import LoginForm from './auth/login';
import RegistrationForm from './auth/sign_up';
import Main from './Main';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const route = userId ? 'Main' : 'LoginForm';
      console.log('this is the route', route);
      setInitialRouteName(route);
    };

    checkOnboardingStatus();
  }, []);

  if (initialRouteName === null) {
    // You can show a loading spinner while determining the initial route
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <UserProvider>
      <StatusBar backgroundColor="purple" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen
            name="LoginForm"
            component={LoginForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={RegistrationForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </UserProvider>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
