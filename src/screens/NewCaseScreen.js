import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useApiCasos } from '../hooks/useApiCasos';
import { sharedStyles } from '../styles/sharedStyles';

const NewCaseScreen = () => {
  const navigation = useNavigation();
  const { createCase } = useApiCasos();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    caseNumber: '',
    location: '',
    description: '',
    requestDate: new Date().toISOString().split('T')[0],
    priority: 'Normal',
    status: 'Em andamento'
  });

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente mais tarde.');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar sua localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setFormData(prev => ({
        ...prev,
        location: `${latitude}, ${longitude}`
      }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização. Tente novamente mais tarde.');
    }
  };

  const validateForm = () => {
    if (!formData.caseNumber.trim()) {
      Alert.alert('Erro', 'Por favor, digite o número do caso');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Erro', 'Por favor, adicione a localização do caso');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Por favor, digite a descrição do caso');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const success = await createCase({
        ...formData,
        images
      });

      if (success) {
        Alert.alert('Sucesso', 'Caso criado com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o caso. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container}>
      <View style={sharedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#123458" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Caso</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={sharedStyles.card}>
          <Text style={sharedStyles.subtitle}>Informações do Caso</Text>
              <TextInput
            style={sharedStyles.input}
            placeholder="Título do Caso"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
              />
                <TextInput
            style={[sharedStyles.input, styles.textArea]}
            placeholder="Descrição"
                multiline
                numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />
        </View>

        <View style={sharedStyles.card}>
          <Text style={sharedStyles.subtitle}>Localização</Text>
          <TouchableOpacity style={sharedStyles.button} onPress={handleGetLocation}>
            <Text style={sharedStyles.buttonText}>Obter Localização Atual</Text>
          </TouchableOpacity>
          {formData.location && (
            <Text style={sharedStyles.text}>
              Lat: {formData.location.latitude}, Long: {formData.location.longitude}
            </Text>
          )}
        </View>

        <TouchableOpacity style={sharedStyles.button} onPress={handleSubmit}>
          <Text style={sharedStyles.buttonText}>Criar Caso</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123458',
    textAlign: 'center',
  },
  formSection: {
    padding: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default NewCaseScreen;
