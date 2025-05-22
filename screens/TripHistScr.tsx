import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppCont, ItinHistItem } from '../context/AppCont';

const TripHistScr = () => {
  const navi = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { sTripData, sIt, sHis } = useAppCont();
  const [localHist, sLocalHist] = useState<ItinHistItem[]>([]);

  const loadHist = async () => {
    try {
      const data = await AsyncStorage.getItem('@trip_history');
      const parsed: ItinHistItem[] = data ? JSON.parse(data) : [];
      sLocalHist(parsed.reverse());
      sHis(parsed)
    } catch (err) {
      Alert.alert('Error', 'Could not load trip history.')
    }
  };

  const handleSelTrip = (item: ItinHistItem) => {
    sTripData(item.trip);
    sIt(item.itin);
    navi.navigate('Results')
  };

  useEffect(() => {
    loadHist()
  }, []);

  const renderItem = ({ item }: { item: ItinHistItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelTrip(item)}>
      <Text style={styles.dest}>{item.trip.dest}</Text>
      <Text style={styles.meta}>Days: {item.trip.days} | Budget: ₹{item.trip.budget}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={localHist}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No trip history found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  dest: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  meta: {
    fontSize: 14,
    marginTop: 4,
    color: '#555'
  },
  date: {
    fontSize: 12,
    marginTop: 6,
    color: '#999'
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40
  }
});

export default TripHistScr;