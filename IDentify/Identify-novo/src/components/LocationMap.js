import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationMap = memo(({ 
  location, 
  onLocationChange, 
  readonly = false 
}) => {
  const [searchLocation, setSearchLocation] = useState(location);
  const [mapCoords, setMapCoords] = useState({ 
    latitude: -23.5505, 
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (location) {
      // Aqui você pode implementar a geocodificação do endereço para coordenadas
      // Por enquanto, vamos apenas simular uma mudança nas coordenadas
      setMapCoords(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() * 0.1 - 0.05),
        longitude: prev.longitude + (Math.random() * 0.1 - 0.05),
      }));
    }
  }, [location]);

  const handleSearch = useCallback(() => {
    if (onLocationChange) {
      onLocationChange(searchLocation);
    }
  }, [searchLocation, onLocationChange]);

  const handleMapPress = useCallback((e) => {
    if (readonly) return;
    
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoords(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  }, [readonly]);

  return (
    <View style={styles.container}>
      {!readonly && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Digite o endereço ou local"
            value={searchLocation}
            onChangeText={setSearchLocation}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.searchButton}
            activeOpacity={0.7}
          >
            <Feather name="search" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.card}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapCoords}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={{
                latitude: mapCoords.latitude,
                longitude: mapCoords.longitude,
              }}
              pinColor="#ef4444"
            />
          </MapView>
          <View style={styles.mapOverlay}>
            <Text style={styles.locationText}>
              {location || 'Selecione uma localização'}
            </Text>
            <Text style={styles.coordsText}>
              Lat: {mapCoords.latitude.toFixed(4)}, Lng: {mapCoords.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      </View>
      {errorMsg && (
        <Text style={styles.errorText}>{errorMsg}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    ...Platform.select({
      ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
      },
      android: {
    elevation: 3,
      },
    }),
  },
  mapContainer: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  locationText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LocationMap;