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
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(data);
      setLoading(false);
    }, (error) => {
      console.error('Error al cargar eventos:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  const filtered = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const currentUser = auth.currentUser;

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 5,
          textAlign: 'center'
        }}>
          Eventos Comunitarios
        </Text>

        <Text style={{
          marginBottom: 20,
          color: 'gray',
          textAlign: 'center'
        }}>
          Bienvenido: {currentUser?.displayName || currentUser?.email}
        </Text>

        {/* Buscador */}
        <TextInput
          placeholder="🔍  Buscar eventos..."
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 15,
          }}
        />

        {/* Botón crear */}
        <TouchableOpacity
          style={{
            backgroundColor: '#4a90e2',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            + Crear Evento
          </Text>
        </TouchableOpacity>

        {/* Lista */}
        {loading ? (
          <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 40 }}>📅</Text>
            <Text style={{ color: 'gray', marginTop: 10, fontSize: 15 }}>
              {search ? 'No se encontraron eventos' : 'Aún no hay eventos'}
            </Text>
          </View>
        ) : (
          filtered.map((event) => {
            const isOwner = event.creatorId === currentUser?.uid;
            const attendees = event.attendees?.length || 0;
            return (
              <View key={event.id} style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 12,
                marginBottom: 15,
              }}>
                {event.category && (
                  <View style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#eef2ff',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}>
                    <Text style={{ color: '#6c63ff', fontSize: 12, fontWeight: '600' }}>
                      {event.category}
                    </Text>
                  </View>
                )}

                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>
                  {event.title}
                </Text>
                <Text style={{ color: 'gray', marginBottom: 4 }}>
                  📅 {event.date} - {event.time}
                </Text>
                <Text style={{ color: 'gray', marginBottom: 10 }}>
                  📍 {event.location}
                </Text>
                <Text style={{ color: 'gray', fontSize: 12, marginBottom: 12 }}>
                  👥 {attendees} {attendees === 1 ? 'asistente' : 'asistentes'}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('DetailEvent', { event })}>
                    <Text style={{ color: '#6c63ff', fontWeight: 'bold' }}>Ver detalles →</Text>
                  </TouchableOpacity>
                  {isOwner && (
                    <TouchableOpacity onPress={() => navigation.navigate('CreateEvent', { event })}>
                      <Text style={{ color: '#4a90e2', fontWeight: 'bold' }}>✏️ Editar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#e74c3c',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNavigation navigation={navigation} />
    </View>
  );
}
