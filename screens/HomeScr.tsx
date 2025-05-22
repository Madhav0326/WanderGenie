import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { TripData, useAppCont } from '../context/AppCont';

const debounce = <T extends (...args: any[]) => void>(func: T, delay = 500) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScr = () => {
  const navi = useNavigation<NavigationProp>();
  const { sTripData } = useAppCont();
  const layout = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const cityImg = [
    require('../assets/vizag.jpg'),
    require('../assets/hyd.jpg'),
    require('../assets/goa.jpg')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current || cityImg.length === 0) return;

      const nextOffset = offset + layout.width;
      const finalOffset = nextOffset >= maxOffset ? 0 : nextOffset;

      scrollRef.current.scrollTo({ x: finalOffset, animated: true });
      setOffset(finalOffset);
    }, 3000);

    return () => clearInterval(interval);
  }, [offset, maxOffset]);

  const [localData, sLocalData] = useState<TripData>({
    dest: '', days: '', budget: '', pref: '',
  });

  const debouncedUpdate = useCallback(
    debounce((data: TripData) => sTripData(data), 500),
    []
  );

  const handleChg = (field: keyof TripData, value: string) => {
    const updated = { ...localData, [field]: value };
    sLocalData(updated);
    debouncedUpdate(updated);
  };

  const handleSub = () => {
    sTripData(localData);
    navi.navigate('Results');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Destination</Text>
      <TextInput
        style={styles.input}
        value={localData.dest}
        onChangeText={(text) => handleChg('dest', text)}
      />

      <Text style={styles.label}>Number of Days</Text>
      <TextInput
        style={styles.input}
        value={localData.days}
        onChangeText={(text) => handleChg('days', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Budget (₹)</Text>
      <TextInput
        style={styles.input}
        value={localData.budget}
        onChangeText={(text) => handleChg('budget', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Preferences</Text>
      <TextInput
        style={styles.input}
        value={localData.pref}
        onChangeText={(text) => handleChg('pref', text)}
        multiline
      />

      <Button title="Generate Itinerary" onPress={handleSub} />

      <View style={styles.sliderWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          onContentSizeChange={(w) => setMaxOffset(w)}
        >
          {cityImg.map((img, idx) => (
            <Image key={idx} source={img} style={[styles.cityImg, { width: layout.width - 40 }]} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  sliderWrapper: {
    marginTop: 100,
    height: 180
  },
  cityImg: {
    height: 180,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover'
  }
});

export default HomeScr;