import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useApiDashboard } from '../hooks/useApiDashboard';
import { Feather } from '@expo/vector-icons';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useApiDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#123458" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[
        styles.header,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('NewCase')}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.newButtonText}>Novo</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#123458']}
            tintColor="#123458"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Card de Boas-vindas */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.welcomeTitle}>
                Bem-vindo, {user?.nome || 'Usuário'}!
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Tipo de usuário: {user?.tipoUsuario?.toUpperCase() || 'USUÁRIO'}
              </Text>
            </View>
          </View>
          <View style={styles.welcomeFooter}>
            <Text style={styles.welcomeFooterText}>
              Último acesso: {formatDate(new Date())}
            </Text>
          </View>
        </View>

        {/* Resumo de Casos */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Resumo de Casos</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Casos')}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
              <Feather name="chevron-right" size={16} color="#123458" />
            </TouchableOpacity>
          </View>
          <View style={styles.summaryGrid}>
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => navigation.navigate('Casos', { filter: 'all' })}
            >
              <Feather name="file-text" size={24} color="#123458" />
              <Text style={styles.summaryNumber}>{data?.totalCasos || 0}</Text>
              <Text style={styles.summaryLabel}>Total de Casos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => navigation.navigate('Casos', { filter: 'in_progress' })}
            >
              <Feather name="clock" size={24} color="#123458" />
              <Text style={styles.summaryNumber}>{data?.casosEmAndamento || 0}</Text>
              <Text style={styles.summaryLabel}>Em Andamento</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => navigation.navigate('Casos', { filter: 'completed' })}
            >
              <Feather name="check-circle" size={24} color="#123458" />
              <Text style={styles.summaryNumber}>{data?.casosFinalizados || 0}</Text>
              <Text style={styles.summaryLabel}>Finalizados</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Casos Recentes */}
        <View style={styles.recentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Casos Recentes</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Casos')}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
              <Feather name="chevron-right" size={16} color="#123458" />
            </TouchableOpacity>
          </View>
          {data?.casosRecentes?.length > 0 ? (
            data.casosRecentes.map((caso) => (
              <TouchableOpacity
                key={caso.id}
                style={styles.casoItem}
                onPress={() => navigation.navigate('CaseDetails', { id: caso.id })}
              >
                <View style={styles.casoHeader}>
                  <Text style={styles.casoTitle}>{caso.titulo}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(caso.status) }
                  ]}>
                    <Text style={styles.statusText}>{caso.status}</Text>
                  </View>
                </View>
                <Text style={styles.casoDescription} numberOfLines={2}>
                  {caso.descricao}
                </Text>
                <View style={styles.casoFooter}>
                  <View style={styles.casoInfo}>
                    <Feather name="calendar" size={14} color="#666" />
                    <Text style={styles.casoDate}>
                      Criado em {formatDate(caso.dataCriacao)}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color="#666" />
              <Text style={styles.emptyStateText}>
                Nenhum caso encontrado
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('NewCase')}
              >
                <Text style={styles.emptyStateButtonText}>
                  Criar novo caso
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'em andamento':
      return '#f59e0b';
    case 'finalizado':
      return '#10b981';
    case 'pendente':
      return '#3b82f6';
    default:
      return '#666';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123458',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#123458',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  newButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
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
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#123458',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123458',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  welcomeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  welcomeFooterText: {
    fontSize: 12,
    color: '#666',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#123458',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#123458',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  casoItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  casoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  casoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#123458',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  casoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  casoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  casoDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#123458',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
});

export default DashboardScreen;
