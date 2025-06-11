import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useUsers, useDeactivateUser, useReactivateUser } from '../hooks/useApiAuth';

const AdminUsersScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const deactivateUser = useDeactivateUser();
  const reactivateUser = useReactivateUser();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeactivate = async (userId) => {
    Alert.prompt(
      'Desativar Usuário',
      'Digite o motivo da desativação:',
      async (motivo) => {
        if (motivo) {
          try {
            await deactivateUser.mutateAsync({ id: userId, motivo });
          } catch (error) {
            console.error('Error deactivating user:', error);
          }
        }
      }
    );
  };

  const handleReactivate = async (userId) => {
    Alert.alert(
      'Reativar Usuário',
      'Tem certeza que deseja reativar este usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Reativar',
          onPress: async () => {
            try {
              await reactivateUser.mutateAsync(userId);
            } catch (error) {
              console.error('Error reactivating user:', error);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#123458" />
          <Text style={styles.loadingText}>Carregando usuários...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#dc2626" />
          <Text style={styles.errorText}>
            Erro ao carregar usuários. Verifique sua conexão e tente novamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredUsers?.map((user) => (
          <View key={user._id} style={styles.userCard}>
            <View style={styles.userInfo}>
              {user.fotoPerfil ? (
                <Image
                  source={{ uri: user.fotoPerfil }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={styles.userAvatarPlaceholder}>
                  <Feather name="user" size={24} color="#666" />
                </View>
              )}
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.nome}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userRoleContainer}>
                  <Text style={[styles.userRole, { backgroundColor: getRoleColor(user.cargo) }]}>
                    {user.cargo}
                  </Text>
                  <Text style={[styles.userStatus, { color: user.status === 'ativo' ? '#22c55e' : '#ef4444' }]}>
                    {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.userActions}>
              {user.status === 'ativo' ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deactivateButton]}
                  onPress={() => handleDeactivate(user._id)}
                >
                  <Feather name="user-x" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Desativar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.reactivateButton]}
                  onPress={() => handleReactivate(user._id)}
                >
                  <Feather name="user-check" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Reativar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return '#ef4444';
    case 'perito':
      return '#3b82f6';
    case 'assistente':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#123458',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  userStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  userActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deactivateButton: {
    backgroundColor: '#ef4444',
  },
  reactivateButton: {
    backgroundColor: '#22c55e',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminUsersScreen;
