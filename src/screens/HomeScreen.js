import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { auth, db } from '../firebase/config';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));

        setEvents(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert(
        'Error',
        'No se pudo cerrar sesión'
      );
    }
  };

  const filtered = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(
        search.toLowerCase()
      ) ||
      e.location?.toLowerCase().includes(
        search.toLowerCase()
      )
  );

  const currentUser = auth.currentUser;

  return (
    <View
      style={{
        flex:1,
        backgroundColor:'#f2f2f2'
      }}
    >

      <ScrollView
        contentContainerStyle={{
          padding:20
        }}
      >

        <Text
          style={{
            fontSize:28,
            fontWeight:'bold',
            marginBottom:5,
            textAlign:'center'
          }}
        >
          Eventos Comunitarios
        </Text>

        <Text
          style={{
            marginBottom:20,
            color:'gray',
            textAlign:'center'
          }}
        >
          Bienvenido: {currentUser?.email}
        </Text>

        <TextInput
          placeholder="🔍 Buscar eventos..."
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor:'white',
            padding:12,
            borderRadius:10,
            marginBottom:20
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor:'#4a90e2',
            padding:15,
            borderRadius:10,
            alignItems:'center',
            marginBottom:20
          }}
          onPress={() =>
            navigation.navigate(
              'CreateEvent'
            )
          }
        >
          <Text
            style={{
              color:'white',
              fontWeight:'bold'
            }}
          >
            + Crear Evento
          </Text>
        </TouchableOpacity>

        {loading ? (

          <ActivityIndicator
            size="large"
          />

        ) : filtered.length === 0 ? (

          <Text
            style={{
              textAlign:'center'
            }}
          >
            No hay eventos
          </Text>

        ) : (

          filtered.map((event) => (

            <View
              key={event.id}
              style={{
                backgroundColor:'white',
                padding:20,
                borderRadius:12,
                marginBottom:15
              }}
            >

              <Text
                style={{
                  fontWeight:'bold',
                  fontSize:18
                }}
              >
                {event.title}
              </Text>

              <Text>
                📅 {event.date}
              </Text>

              <Text>
                📍 {event.location}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    'DetailEvent',
                    {event}
                  )
                }
              >
                <Text
                  style={{
                    color:'#4a90e2'
                  }}
                >
                  Ver detalles →
                </Text>
              </TouchableOpacity>

            </View>

          ))

        )}

        <TouchableOpacity
          style={{
            backgroundColor:'#e74c3c',
            padding:15,
            borderRadius:10,
            alignItems:'center',
            marginTop:10,
            marginBottom:20
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              color:'white',
              fontWeight:'bold'
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