import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface Props { isDarkMode: boolean }

const features = [
  { title: 'Personalized Itineraries', description: 'Tailored plans just for you.' },
  { title: 'Real-Time Updates', description: 'Stay informed on the go.' },
  { title: 'Seamless Bookings', description: 'Book everything in one place.' }
];

const Features: React.FC<Props> = ({ isDarkMode }) => (
  <View style={styles.container}>
    {features.map((feature, index) => (
      <View key={index} style={[styles.featureBox, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.featureTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{feature.title}</Text>
        <Text style={[styles.featureDesc, { color: isDarkMode ? '#ccc' : '#666' }]}>{feature.description}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  feature: {
    marginBottom: 20
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  featureDesc: {
    fontSize: 16,
    marginTop: 5
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  }
});

export default Features;