import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import { signOut } from 'firebase/auth';

import { auth } from '../firebase/config';

export default function HomeScreen({ navigation }) {

  const handleLogout = async () => {

    try {

      await signOut(auth);

      Alert.alert(
        'Sesión cerrada',
        'Has cerrado sesión correctamente'
      );

    } catch (error) {

      Alert.alert(
        'Error',
        'No se pudo cerrar sesión'
      );

    }

  };

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2'
      }}
    >

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 10
        }}
      >
        Eventos Comunitarios
      </Text>

      <Text
        style={{
          marginBottom: 25,
          color: 'gray'
        }}
      >
        Bienvenido: {auth.currentUser?.email}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          marginBottom: 15
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          Festival Local
        </Text>

        <Text>10 Mayo - Parque Central</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#4a90e2',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 15
        }}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Crear Evento
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#e74c3c',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center'
        }}
        onPress={handleLogout}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </Text>
      </TouchableOpacity>

    </View>

  );
}