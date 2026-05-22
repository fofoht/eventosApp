import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'; //esta libreria tiene para hacer calendarios

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

export default function CreateEventScreen() {

//constantes para tiempo y fecha
const [date, setDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [time, setTime] = useState(new Date());
const [showTimePicker, setShowTimePicker] = useState(false);

const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [location, setLocation] = useState('');

  const handleCreateEvent = () => {

    if (
      !title ||
      !description ||
      !location ||
      !date ||
      !time
    ) {

      Alert.alert(
        'Error',
        'Completa todos los campos'
      );

      return;
    }

    Alert.alert(
      'Evento creado',
      'El evento fue registrado correctamente'
    );

  };

  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f2f2f2'
      }}
    >

      <View
        style={{
          padding: 25
        }}
      >

        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 25
          }}
        >
          Crear Evento
        </Text>

        <TextInput
          placeholder="Título del evento"
          value={title}
          onChangeText={setTitle}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15
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
            textAlignVertical: 'top'
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
            marginBottom: 15
          }}
        />

        {/* Este es para la fecha */}

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15
        }}
      >

        <Text>
          Fecha: 
          {date.toLocaleDateString()}
        </Text>

      </TouchableOpacity>

      {showDatePicker && (

        <DateTimePicker
          value={date}
          mode="date"
          display="default"

          onChange={(event, selectedDate) => {

            setShowDatePicker(false);

            if (selectedDate) {
              setDate(selectedDate);
            }

          }}
        />

      )}
      {/* Este es para la hora */}
      <TouchableOpacity
      onPress={() => setShowTimePicker(true)}
      style={{
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15
      }}
    >

      <Text>
        Hora: 
        {time.toLocaleTimeString()}
      </Text>

    </TouchableOpacity>
    {showTimePicker && (

      <DateTimePicker
        value={time}
        mode="time"
        display="default"

        onChange={(event, selectedTime) => {

          setShowTimePicker(false);

          if (selectedTime) {
            setTime(selectedTime);
          }

        }}
      />

    )}
    
        <TouchableOpacity
          style={{
            backgroundColor: '#4a90e2',
            padding: 18,
            borderRadius: 10,
            alignItems: 'center'
          }}
          onPress={handleCreateEvent}
        >

          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16
            }}
          >
            Crear Evento
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>

  );

}