import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import {
  signInWithEmailAndPassword, signOut
} from 'firebase/auth';

import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email || !password) {

      Alert.alert(
        'Error',
        'Completa todos los campos'
      );

      return;
    }

    try {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  if (!user.emailVerified) {

    await signOut(auth);

    Alert.alert(
      'Verifica tu correo',
      'Debes verificar tu email antes de iniciar sesión'
    );

    return;
  }

  Alert.alert(
    'Bienvenido',
    'Inicio de sesión exitoso'
  );

} catch (error) {

  Alert.alert(
    'Error',
    'Correo o contraseña incorrectos'
  );

}

  };

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#f2f2f2'
      }}
    >

      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 30,
          textAlign: 'center'
        }}
      >
        Community Events
      </Text>

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15
        }}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#4a90e2',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center'
        }}
        onPress={handleLogin}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text
          style={{
            marginTop: 20,
            textAlign: 'center'
          }}
        >
          ¿No tienes cuenta? Registrarse
        </Text>
      </TouchableOpacity>

    </View>

  );
}