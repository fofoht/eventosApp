import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import {createUserWithEmailAndPassword, sendEmailVerification,signOut} from 'firebase/auth';
import { auth } from '../firebase/config';

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {

    if (!name || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {

      const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
        
      await sendEmailVerification(
    userCredential.user
  );

  
    await signOut(auth);

    Alert.alert(
    'Cuenta creada',
    'Se envió un correo de verificación'
    );  
    navigation.navigate('Login')

      

      

    } catch (error) {

      Alert.alert(
        'Error',
        error.message
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
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 30,
          textAlign: 'center'
        }}
      >
        Registro
      </Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15
        }}
      />

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
        onPress={handleRegister}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Registrarse
        </Text>
      </TouchableOpacity>

    </View>

  );
}