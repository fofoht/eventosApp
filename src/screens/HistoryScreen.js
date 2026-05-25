import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import BottomNavigation from '../components/BottomNavigation';

export default function HistoryScreen({ navigation }) {
  const [myEvents, setMyEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Eventos que el usuario creó
        const createdQ = query(
          collection(db, 'events'),
          where('creatorId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const createdSnap = await getDocs(createdQ);
        const created = createdSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Eventos a los que el usuario confirmó asistencia
        const attendedQ = query(
          collection(db, 'events'),
          where('attendees', 'array-contains', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const attendedSnap = await getDocs(attendedQ);
        const attended = attendedSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((e) => e.creatorId !== currentUser.uid); // Evitar duplicados

        setMyEvents(created);
        setAttendedEvents(attended);
      } catch (e) {
        console.error('Error cargando historial:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const EventCard = ({ event, label }) => (
    <View style={{
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
    }}>
      {/* Badge */}
      <View style={{
        alignSelf: 'flex-start',
        backgroundColor: label === 'Creado' ? '#eef2ff' : '#eafaf1',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
        marginBottom: 8,
      }}>
        <Text style={{
          color: label === 'Creado' ? '#6c63ff' : '#27ae60',
          fontSize: 12,
          fontWeight: '600',
        }}>
          {label === 'Creado' ? '✏️ Creado por mí' : '✓ Confirmé asistencia'}
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>
        {event.title}
      </Text>
      <Text style={{ color: 'gray', marginBottom: 4 }}>
        📅 {event.date} - {event.time}
      </Text>
      <Text style={{ color: 'gray', marginBottom: 8 }}>
        📍 {event.location}
      </Text>

      {/* Stats */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        marginTop: 5,
      }}>
        <Text style={{ color: 'gray', fontSize: 13 }}>
          👥 {event.attendees?.length || 0} asistentes
        </Text>
        <Text style={{ color: 'gray', fontSize: 13 }}>
          ⭐ {event.rating || '—'} ({event.ratingCount || 0} votos)
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 90 }}>

        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 25 }}>
          Historial de Eventos
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Eventos creados */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#6c63ff' }}>
              📋 Eventos que creé ({myEvents.length})
            </Text>

            {myEvents.length === 0 ? (
              <View style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 25,
              }}>
                <Text style={{ fontSize: 32 }}>📝</Text>
                <Text style={{ color: 'gray', marginTop: 8 }}>
                  Aún no has creado eventos
                </Text>
              </View>
            ) : (
              myEvents.map((e) => (
                <EventCard key={e.id} event={e} label="Creado" />
              ))
            )}

            {/* Eventos a los que asistió */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#27ae60' }}>
              ✅ Eventos en los que participé ({attendedEvents.length})
            </Text>

            {attendedEvents.length === 0 ? (
              <View style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 25,
              }}>
                <Text style={{ fontSize: 32 }}>📅</Text>
                <Text style={{ color: 'gray', marginTop: 8 }}>
                  Aún no has confirmado asistencia a ningún evento
                </Text>
              </View>
            ) : (
              attendedEvents.map((e) => (
                <EventCard key={e.id} event={e} label="Asistido" />
              ))
            )}
          </>
        )}

      </ScrollView>

      <BottomNavigation navigation={navigation} />
    </View>
  );
}
