import {
  View,
  TouchableOpacity
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigation({
  navigation
}) {

  return (

    <View
      style={{
        height: 70,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd'
      }}
    >

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Home')
        }
      >

        <Ionicons
          name="home"
          size={28}
          color="#6c63ff"
        />

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('History')
        }
      >

        <Ionicons
          name="calendar"
          size={28}
          color="gray"
        />

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Statistics')
        }
      >

        <Ionicons
          name="stats-chart"
          size={28}
          color="gray"
        />

      </TouchableOpacity>

    </View>

  );

}