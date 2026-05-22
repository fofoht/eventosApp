import { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';

export default function HistoryScreen() {

  const [comment, setComment] = useState('');

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
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 25
          }}
        >
          Historial de Eventos
        </Text>

        {/* EVENTO */}

        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20
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

          <Text
            style={{
              marginBottom: 5
            }}
          >
            📅 14 de Mayo - 2:00pm
          </Text>

          <Text
            style={{
              marginBottom: 20
            }}
          >
            📍 Parque Central
          </Text>

          {/* CALIFICACION */}

          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 10
            }}
          >
            Calificación
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20
            }}
          >

            <Text style={{ fontSize: 24 }}>
              ⭐⭐⭐⭐⭐
            </Text>

          </View>

          {/* COMENTARIO */}

          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 10
            }}
          >
            Comentario
          </Text>

          <TextInput
            placeholder="Escribe tu comentario"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: '#f2f2f2',
              padding: 15,
              borderRadius: 10,
              height: 120,
              textAlignVertical: 'top',
              marginBottom: 20
            }}
          />

          {/* BOTON */}

          <TouchableOpacity
            style={{
              backgroundColor: '#6c63ff',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center'
            }}
          >

            <Text
              style={{
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Guardar Reseña
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </ScrollView>

  );

}