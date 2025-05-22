import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import Features from '../components/Features';

const LandScr = () => {
  const navi = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isDark = useColorScheme() === 'dark';

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>WanderGenie</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#333' }]}>Your AI Travel Planner</Text>

        <TouchableOpacity style={styles.button} onPress={() => navi.navigate('Home')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navi.navigate('History')}>
          <Text style={styles.secondaryText}>View Saved Trips</Text>
        </TouchableOpacity>

        <Features isDarkMode={isDark} />

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 50,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor:'#00b6df',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryButton: {
    marginTop: 20
  },
  secondaryText: {
    color:'#0073ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default LandScr;