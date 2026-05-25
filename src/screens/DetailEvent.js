import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function DetailEvent({ route, navigation }) {
  const { event } = route.params;
  const currentUser = auth.currentUser;
  const isOwner = event.creatorId === currentUser?.uid;

  const [attending, setAttending] = useState(event.attendees?.includes(currentUser?.uid));
  const [attendeesCount, setAttendeesCount] = useState(event.attendees?.length || 0);
  const [notifications, setNotifications] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(event.rating || 0);
  const [ratingCount, setRatingCount] = useState(event.ratingCount || 0);

  // Cargar comentarios en tiempo real
  useEffect(() => {
    const q = query(
      collection(db, 'events', event.id, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Cargar calificación del usuario
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const ratingSnap = await getDoc(
          doc(db, 'events', event.id, 'ratings', currentUser.uid)
        );
        if (ratingSnap.exists()) setUserRating(ratingSnap.data().value);
      } catch (e) { console.error(e); }
    };
    fetchRating();
  }, []);

  // Confirmar asistencia
  const handleRSVP = async () => {
    try {
      await updateDoc(doc(db, 'events', event.id), {
        attendees: attending
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });
      setAttending(!attending);
      setAttendeesCount(attending ? attendeesCount - 1 : attendeesCount + 1);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar tu asistencia.');
    }
  };

  // Compartir evento
  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Te invito al evento "${event.title}"!\n📅 ${event.date} - ${event.time}\n📍 ${event.location}`,
        title: event.title,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el evento.');
    }
  };

  // Eliminar evento (solo creador)
  const handleDelete = () => {
    Alert.alert('Eliminar evento', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'events', event.id));
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el evento.');
          }
        },
      },
    ]);
  };

  // Enviar comentario
  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      await addDoc(collection(db, 'events', event.id, 'comments'), {
        text: newComment.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch {
      Alert.alert('Error', 'No se pudo enviar el comentario.');
    } finally {
      setSendingComment(false);
    }
  };

  // Calificar evento
  const handleRate = async (stars) => {
    try {
      const ratingRef = doc(db, 'events', event.id, 'ratings', currentUser.uid);
      const ratingSnap = await getDoc(ratingRef);

      let newAvg, newCount;
      if (ratingSnap.exists()) {
        const oldValue = ratingSnap.data().value;
        newCount = ratingCount;
        newAvg = ((avgRating * ratingCount) - oldValue + stars) / ratingCount;
      } else {
        newCount = ratingCount + 1;
        newAvg = ((avgRating * ratingCount) + stars) / newCount;
      }

      await setDoc(ratingRef, { value: stars, userId: currentUser.uid });
      await updateDoc(doc(db, 'events', event.id), {
        rating: parseFloat(newAvg.toFixed(1)),
        ratingCount: newCount,
      });

      setUserRating(stars);
      setAvgRating(parseFloat(newAvg.toFixed(1)));
      setRatingCount(newCount);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar tu calificación.');
    }
  };

  const stars = (count, filled) =>
    [1, 2, 3, 4, 5].map((s) => (
      <TouchableOpacity key={s} onPress={() => !filled && handleRate(s)}>
        <Text style={{ fontSize: filled ? 18 : 28 }}>
          {s <= count ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    ));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={{ padding: 25 }}>

        {/* Título */}
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
          {event.title}
        </Text>

        {/* Categoría */}
        {event.category && (
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: '#eef2ff',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
            marginBottom: 15,
          }}>
            <Text style={{ color: '#6c63ff', fontWeight: '600' }}>{event.category}</Text>
          </View>
        )}

        <Text style={{ marginBottom: 8, fontSize: 16 }}>📅 {event.date} - {event.time}</Text>
        <Text style={{ marginBottom: 8, fontSize: 16 }}>📍 {event.location}</Text>
        <Text style={{ marginBottom: 20, fontSize: 14, color: 'gray' }}>
          👤 Organizado por {event.creatorEmail?.split('@')[0]}
        </Text>

        {/* Descripción */}
        <View style={{
          backgroundColor: 'white',
          padding: 18,
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>Descripción</Text>
          <Text style={{ lineHeight: 22, color: '#444' }}>{event.description}</Text>
        </View>

        {/* Asistentes */}
        <Text style={{ color: 'gray', marginBottom: 15, textAlign: 'center' }}>
          👥 {attendeesCount} {attendeesCount === 1 ? 'persona asistirá' : 'personas asistirán'}
        </Text>

        {/* CONFIRMAR ASISTENCIA */}
        <TouchableOpacity
          onPress={handleRSVP}
          style={{
            backgroundColor: attending ? '#27ae60' : '#4a90e2',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {attending ? '✓ Asistiré' : 'Confirmar Asistencia'}
          </Text>
        </TouchableOpacity>

        {/* COMPARTIR */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            backgroundColor: '#6c63ff',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Compartir Evento</Text>
        </TouchableOpacity>

        {/* Acciones del creador */}
        {isOwner && (
          <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateEvent', { event })}
              style={{
                flex: 1,
                backgroundColor: '#4a90e2',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                flex: 1,
                backgroundColor: '#e74c3c',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* NOTIFICACIONES */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 25,
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 12,
        }}>
          <TouchableOpacity
            onPress={() => setNotifications(!notifications)}
            style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#6c63ff',
              borderRadius: 4,
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: notifications ? '#6c63ff' : 'white',
            }}
          >
            {notifications && <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>}
          </TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Deseo recibir notificaciones</Text>
        </View>

        {/* CALIFICACIÓN */}
        <View style={{
          backgroundColor: 'white',
          padding: 18,
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Calificación</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1a1a2e' }}>
                {avgRating || '—'}
              </Text>
              <View style={{ flexDirection: 'row' }}>{stars(Math.round(avgRating), true)}</View>
              <Text style={{ color: 'gray', fontSize: 12, marginTop: 4 }}>
                {ratingCount} calificaciones
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'gray', marginBottom: 8 }}>Tu calificación</Text>
              <View style={{ flexDirection: 'row' }}>{stars(userRating, false)}</View>
              {userRating > 0 && (
                <Text style={{ color: '#27ae60', fontSize: 12, marginTop: 4 }}>
                  ¡Gracias por calificar!
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* COMENTARIOS */}
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
          Comentarios ({comments.length})
        </Text>

        {/* Input de comentario */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 15,
          marginBottom: 15,
        }}>
          <TextInput
            placeholder="Escribe un comentario..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: '#f2f2f2',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              textAlignVertical: 'top',
              minHeight: 80,
            }}
          />
          <TouchableOpacity
            onPress={handleSendComment}
            disabled={!newComment.trim() || sendingComment}
            style={{
              backgroundColor: '#6c63ff',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              opacity: !newComment.trim() || sendingComment ? 0.5 : 1,
            }}
          >
            {sendingComment
              ? <ActivityIndicator color="white" size="small" />
              : <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar Comentario</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Lista de comentarios */}
        {comments.length === 0 ? (
          <Text style={{ color: 'gray', textAlign: 'center', marginBottom: 20 }}>
            Sé el primero en comentar
          </Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#6c63ff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {(c.userName || 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{c.userName}</Text>
                  <Text style={{ color: 'gray', fontSize: 11 }}>
                    {c.createdAt?.toDate
                      ? c.createdAt.toDate().toLocaleDateString('es-SV')
                      : 'Ahora'}
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#444', lineHeight: 20 }}>{c.text}</Text>
            </View>
          ))
        )}

      </View>
    </ScrollView>
  );
}
