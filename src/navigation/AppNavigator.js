import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase/config';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);
      setLoading(false);

    });

    return unsubscribe;

  }, []);

  if (loading) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Cargando...</Text>
    </View>
  );
}

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {user && user.emailVerified ?  (

          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="CreateEvent"
              component={CreateEventScreen}
            />
          </>

        ) : (

          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>

  );
}