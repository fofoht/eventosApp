import { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

export default function DetailEvent({ navigation }) {

  const [notifications, setNotifications] =
    useState(false);

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

        {/* TITULO */}

        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 15
          }}
        >
          Festival del Mango
        </Text>

        {/* FECHA */}

        <Text
          style={{
            marginBottom: 10,
            fontSize: 16
          }}
        >
          📅 14 de Mayo - 2:00pm
        </Text>

        {/* UBICACION */}

        <Text
          style={{
            marginBottom: 20,
            fontSize: 16
          }}
        >
          📍 Parque Central
        </Text>

        {/* DESCRIPCION */}

        <View
          style={{
            backgroundColor: 'white',
            padding: 18,
            borderRadius: 12,
            marginBottom: 20
          }}
        >

          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 16
            }}
          >
            Descripción
          </Text>

          <Text>
            Festival comunitario con música,
            comida y actividades recreativas
            para toda la familia.
          </Text>

        </View>

        {/* ASISTENCIA */}

        <TouchableOpacity
          style={{
            backgroundColor: '#4a90e2',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15
          }}
        >

          <Text
            style={{
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Confirmar Asistencia
          </Text>

        </TouchableOpacity>

        {/* COMPARTIR */}

        <TouchableOpacity
          style={{
            backgroundColor: '#6c63ff',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20
          }}
        >

          <Text
            style={{
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Compartir Evento
          </Text>

        </TouchableOpacity>

        {/* NOTIFICACIONES */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 25
          }}
        >

          <TouchableOpacity
            onPress={() =>
              setNotifications(!notifications)
            }
            style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#6c63ff',
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >

            {notifications && (
              <Text>✓</Text>
            )}

          </TouchableOpacity>

          <Text>
            Deseo recibir notificaciones
          </Text>

        </View>

        

      </View>

    </ScrollView>

  );

}