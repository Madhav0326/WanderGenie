import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, Dimensions, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useAppCont } from '../context/AppCont';
import { genIt } from '../services/aiSer';
import { TabView, TabBar } from 'react-native-tab-view';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';

const layout = Dimensions.get('window');

const labelStyleLight = { fontSize: 14, fontWeight: '600', color: '#000' };
const labelStyleDark = { fontSize: 14, fontWeight: '600', color: '#fff' };

type Route = { key: string; title: string };

const ResScr = () => {
  const isDark = useColorScheme() === 'dark';
  const { tripData, itin, sIt, history, sHis } = useAppCont();
  const [load, sLoad] = useState(true);
  const [routes, sRoutes] = useState<Route[]>([]);
  const [index, sInd] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      sLoad(true);
      try {
        const response = await genIt(
          tripData.dest,
          tripData.days,
          tripData.budget,
          tripData.pref
        );
        const daywise = response.split(/(?=Day\s\d+:)/i);
        sIt(daywise);
        sRoutes(daywise.map((_, idx) => ({ key: `day${idx}`, title: `Day ${idx + 1}` })));

        const entry = {
          id: `trip_${Date.now()}`,
          date: new Date().toISOString(),
          trip: tripData,
          itin: daywise,
        };
        const updatedHist = [entry, ...history];
        sHis(updatedHist);
        await AsyncStorage.setItem('@trip_history', JSON.stringify(updatedHist));
        await AsyncStorage.setItem('@last_itinerary', JSON.stringify(entry));
      } catch (err) {
        sIt(['Failed to generate itinerary.']);
      } finally {
        sLoad(false);
      }
    };
    fetchData();
  }, []);

  const shareItin = async () => {
    try {
      const text = itin.join('\n\n');
      await Share.open({ message: text });
    } catch (error) {
      console.warn('Share failed:', error);
    }
  };

  const expToPDF = async () => {
    const html = itin
      .map(
        (day, idx) =>
          `<h2>${day.match(/Day\s\d+/i)?.[0] || `Day ${idx + 1}`}</h2><p>${day.replace(/Day\s\d+:/i, '').trim()}</p>`
      )
      .join('');

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the PDF',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Cannot save PDF without storage permission.');
        return;
      }
    }

    try {
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: 'WanderGenie_Itinerary',
        directory: 'Documents',
      });
      Alert.alert('Done', `PDF saved to ${file.filePath}`);
    } catch (e) {
      Alert.alert('Failed to export PDF.');
    }
  };

  const renderScene = ({ route }: { route: Route }) => {
    const idx = parseInt(route.key.replace('day', ''));
    const text = itin[idx] || '';
    return (
      <ScrollView style={[styles.scene, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={[styles.dayHeader, { color: isDark ? '#fff' : '#000' }]}> 
          {text.match(/Day\s\d+/i)?.[0] || `Day ${idx + 1}`}
        </Text>
        <Text style={[styles.dayDetails, { color: isDark ? '#ccc' : '#222' }]}> 
          {text.replace(/Day\s\d+:/i, '').trim()}
        </Text>
      </ScrollView>
    );
  };

  if (load) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ marginTop: 10 }}>Loading itinerary...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={sInd}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#1e90ff' }}
            style={{ backgroundColor: isDark ? '#000' : '#fff' }}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={shareItin}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={expToPDF}>
        <Text style={styles.buttonText}>Export to PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scene: {
    flex: 1,
    padding: 20
  },
  dayHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12
  },
  dayDetails: {
    fontSize: 16,
    lineHeight: 24
  },
  button: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ResScr;