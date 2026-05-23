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

export default function StatisticsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // Stats globales
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [topEvent, setTopEvent] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);

  // Stats del usuario
  const [myEventsCount, setMyEventsCount] = useState(0);
  const [myAttendeesTotal, setMyAttendeesTotal] = useState(0);
  const [myAvgRating, setMyAvgRating] = useState(0);
  const [myAttendedCount, setMyAttendedCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Todos los eventos
        const allSnap = await getDocs(collection(db, 'events'));
        const allEvents = allSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Stats globales
        setTotalEvents(allEvents.length);

        const totalAtt = allEvents.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);
        setTotalAttendees(totalAtt);

        // Evento más popular (más asistentes)
        const sorted = [...allEvents].sort(
          (a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0)
        );
        if (sorted.length > 0) setTopEvent(sorted[0]);

        // Stats por categoría
        const catMap = {};
        allEvents.forEach((e) => {
          const cat = e.category || 'General';
          if (!catMap[cat]) catMap[cat] = { count: 0, attendees: 0 };
          catMap[cat].count++;
          catMap[cat].attendees += e.attendees?.length || 0;
        });
        const catArray = Object.entries(catMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.count - a.count);
        setCategoryStats(catArray);

        // Contar comentarios totales (subcollecciones)
        let commentsTotal = 0;
        for (const event of allEvents) {
          const commSnap = await getDocs(collection(db, 'events', event.id, 'comments'));
          commentsTotal += commSnap.size;
        }
        setTotalComments(commentsTotal);

        // Stats del usuario actual
        const myEvents = allEvents.filter((e) => e.creatorId === currentUser.uid);
        setMyEventsCount(myEvents.length);

        const myAtt = myEvents.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);
        setMyAttendeesTotal(myAtt);

        const rated = myEvents.filter((e) => e.ratingCount > 0);
        if (rated.length > 0) {
          const avg = rated.reduce((sum, e) => sum + (e.rating || 0), 0) / rated.length;
          setMyAvgRating(parseFloat(avg.toFixed(1)));
        }

        const attended = allEvents.filter(
          (e) => e.attendees?.includes(currentUser.uid) && e.creatorId !== currentUser.uid
        );
        setMyAttendedCount(attended.length);

      } catch (e) {
        console.error('Error cargando estadísticas:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const CATEGORY_COLORS = {
    General:   '#4a90e2',
    Cultura:   '#e67e22',
    Deporte:   '#27ae60',
    Música:    '#8e44ad',
    Educación: '#2471a3',
    Comida:    '#c0392b',
  };

  const StatCard = ({ emoji, label, value, color }) => (
    <View style={{
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      margin: 5,
    }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: color || '#1a1a2e', marginTop: 4 }}>
        {value}
      </Text>
      <Text style={{ color: 'gray', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 90 }}>

        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 25 }}>
          Estadísticas
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Stats globales */}
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#6c63ff',
              marginBottom: 12,
            }}>
              🌐 Estadísticas Generales
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <StatCard emoji="📅" label="Total de eventos" value={totalEvents} color="#4a90e2" />
              <StatCard emoji="👥" label="Total de asistentes" value={totalAttendees} color="#27ae60" />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <StatCard emoji="💬" label="Total de comentarios" value={totalComments} color="#6c63ff" />
              <StatCard emoji="⭐" label="Evento más popular" value={topEvent ? `${topEvent.attendees?.length || 0} asist.` : '—'} color="#e67e22" />
            </View>

            {/* Evento más popular */}
            {topEvent && (
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 18,
                marginBottom: 20,
                borderLeftWidth: 4,
                borderLeftColor: '#e67e22',
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#e67e22', marginBottom: 6 }}>
                  🏆 Evento más popular
                </Text>
                <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 4 }}>
                  {topEvent.title}
                </Text>
                <Text style={{ color: 'gray', fontSize: 13 }}>
                  📅 {topEvent.date} · 📍 {topEvent.location}
                </Text>
                <Text style={{ color: 'gray', fontSize: 13, marginTop: 4 }}>
                  👥 {topEvent.attendees?.length || 0} asistentes · ⭐ {topEvent.rating || '—'}
                </Text>
              </View>
            )}

            {/* Stats por categoría */}
            {categoryStats.length > 0 && (
              <>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#6c63ff',
                  marginBottom: 12,
                }}>
                  🏷️ Eventos por Categoría
                </Text>

                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 18,
                  marginBottom: 20,
                }}>
                  {categoryStats.map((cat) => {
                    const pct = totalEvents > 0
                      ? Math.round((cat.count / totalEvents) * 100)
                      : 0;
                    const color = CATEGORY_COLORS[cat.name] || '#4a90e2';
                    return (
                      <View key={cat.name} style={{ marginBottom: 14 }}>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}>
                          <Text style={{ fontWeight: '600', color: '#333' }}>{cat.name}</Text>
                          <Text style={{ color: 'gray', fontSize: 13 }}>
                            {cat.count} evento{cat.count !== 1 ? 's' : ''} · {cat.attendees} asist.
                          </Text>
                        </View>
                        {/* Barra de progreso */}
                        <View style={{
                          height: 8,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 4,
                        }}>
                          <View style={{
                            height: 8,
                            width: `${pct}%`,
                            backgroundColor: color,
                            borderRadius: 4,
                          }} />
                        </View>
                        <Text style={{ color: 'gray', fontSize: 11, marginTop: 2 }}>
                          {pct}% del total
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* Stats del usuario */}
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#4a90e2',
              marginBottom: 12,
            }}>
              👤 Mis Estadísticas
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <StatCard emoji="✏️" label="Eventos creados" value={myEventsCount} color="#4a90e2" />
              <StatCard emoji="✅" label="Eventos asistidos" value={myAttendedCount} color="#27ae60" />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <StatCard emoji="👥" label="Asistentes en mis eventos" value={myAttendeesTotal} color="#6c63ff" />
              <StatCard emoji="⭐" label="Mi calificación promedio" value={myAvgRating || '—'} color="#e67e22" />
            </View>

          </>
        )}

      </ScrollView>

      <BottomNavigation navigation={navigation} />
    </View>
  );
}
