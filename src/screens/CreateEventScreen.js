import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const CATEGORIES = ['General', 'Cultura', 'Deporte', 'Música', 'Educación', 'Comida'];

export default function CreateEventScreen({ navigation, route }) {
  const editingEvent = route?.params?.event || null;

  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [location, setLocation] = useState(editingEvent?.location || '');
  const [category, setCategory] = useState(editingEvent?.category || 'General');
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!title || !description || !location) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const eventData = {
        title,
        description,
        location,
        category,
        date: date.toLocaleDateString('es-SV'),
        time: time.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }),
      };

      if (editingEvent) {
        // Editar evento existente
        await updateDoc(doc(db, 'events', editingEvent.id), eventData);
        Alert.alert('¡Listo!', 'Evento actualizado correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Crear nuevo evento
        await addDoc(collection(db, 'events'), {
          ...eventData,
          creatorId: user.uid,
          creatorEmail: user.email,
          createdAt: serverTimestamp(),
          attendees: [],
          rating: 0,
          ratingCount: 0,
        });
        Alert.alert('¡Evento creado!', 'El evento fue registrado correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el evento.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={{ padding: 25 }}>

        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 25 }}>
          {editingEvent ? 'Editar Evento' : 'Crear Evento'}
        </Text>

        <TextInput
          placeholder="Título del evento"
          value={title}
          onChangeText={setTitle}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        />

        <TextInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            height: 120,
            textAlignVertical: 'top',
          }}
        />

        <TextInput
          placeholder="Ubicación"
          value={location}
          onChangeText={setLocation}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        />

        {/* Selector de fecha */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text>📅 Fecha: {date.toLocaleDateString('es-SV')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Selector de hora */}
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text>🕐 Hora: {time.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        {/* Categoría */}
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Categoría</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                backgroundColor: category === cat ? '#6c63ff' : 'white',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: category === cat ? '#6c63ff' : '#ddd',
              }}
            >
              <Text style={{
                color: category === cat ? 'white' : 'gray',
                fontWeight: '600',
              }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botón guardar */}
        <TouchableOpacity
          style={{
            backgroundColor: '#4a90e2',
            padding: 18,
            borderRadius: 10,
            alignItems: 'center',
            opacity: loading ? 0.6 : 1,
          }}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
              </Text>
          }
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
