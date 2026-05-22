import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';

import BottomNavigation from '../components/BottomNavigation';

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
      backgroundColor: '#f2f2f2'
    }}
  >

    <ScrollView
      contentContainerStyle={{
        padding: 20
      }}
    >

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center'
        }}
      >
        Eventos Comunitarios
      </Text>

      <Text
        style={{
          marginBottom: 25,
          color: 'gray',
          textAlign: 'center'
        }}
      >
        Bienvenido: {auth.currentUser?.email}
      </Text>

      {/* EVENTO 1 */}

      <View
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
            fontWeight: 'bold',
            marginBottom: 10
          }}
        >
          Festival del Mango
        </Text>

        <Text>
          14 de Mayo - 2:00pm
        </Text>

        <Text
          style={{
            marginBottom: 15
          }}
        >
          Parque Central
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailEvent')
          }
        >

          <Text
            style={{
              color: '#6c63ff',
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            Ver detalles
          </Text>

        </TouchableOpacity>

      </View>

      {/* EVENTO 2 */}

      <View
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
            fontWeight: 'bold',
            marginBottom: 10
          }}
        >
          Festival de las Pupusas
        </Text>

        <Text>
          18 de Mayo - 5:00pm
        </Text>

        <Text
          style={{
            marginBottom: 15
          }}
        >
          Plaza Municipal
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailEvent')
          }
        >

          <Text
            style={{
              color: '#6c63ff',
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            Ver detalles
          </Text>

        </TouchableOpacity>

      </View>

      {/* BOTON CREAR */}

      <TouchableOpacity
        style={{
          backgroundColor: '#4a90e2',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 15
        }}
        onPress={() =>
          navigation.navigate('CreateEvent')
        }
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

      {/* LOGOUT */}

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

    </ScrollView>
          <BottomNavigation
            navigation={navigation}
            />
  </View>
);
}