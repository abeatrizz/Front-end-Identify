import Toast from 'react-native-toast-message';

export const showToast = ({ title, description, type = 'success' }) => {
  Toast.show({
    type,
    text1: title,
    text2: description,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

export const toastConfig = {
  success: (props) => (
    <View style={[styles.container, styles.success]}>
      <Text style={styles.title}>{props.text1}</Text>
      {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
    </View>
  ),
  error: (props) => (
    <View style={[styles.container, styles.error]}>
      <Text style={styles.title}>{props.text1}</Text>
      {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
    </View>
  ),
};

const styles = {
  container: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
}; 