import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from './Background';
import { Arctic, Sky } from './Constants';
import Btn from './Btn';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [storedUserDetails, setStoredUserDetails] = useState(null);

  useEffect(() => {
    // Fetch user details from AsyncStorage
    const fetchUserDetails = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userDetails');
        const userDetails = jsonValue != null ? JSON.parse(jsonValue) : null;
        setStoredUserDetails(userDetails);
        console.log('Fetched User Details:', userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogin = () => {
    try {
      console.log('Credentials:', credentials);
      console.log('Stored User Details:', storedUserDetails);

      if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password');
      } else if (storedUserDetails) {
        console.log('Stored Email:', storedUserDetails.email);
        console.log('Stored Password:', storedUserDetails.password);

        if (credentials.email === storedUserDetails.email && credentials.password === storedUserDetails.password) {
          setError('');
          Alert.alert('Logged In', 'You have successfully logged in.');
          props.navigation.navigate('AudioRecorder');
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('No stored user details found');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to your account</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Email / Username"
                keyboardType="email-address"
                value={credentials.email}
                onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                placeholderTextColor={Arctic}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Password"
                secureTextEntry={true}
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                placeholderTextColor={Arctic}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={{ color: Sky, fontWeight: 'bold', fontSize: 16 }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <Btn textColor="white" bgColor={Arctic} btnLabel="Login" Press={handleLogin} />
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: moderateScale(54),
    fontWeight: 'bold',
    marginVertical: verticalScale(10),
  },
  formContainer: {
    backgroundColor: 'white',
    height: verticalScale(700),
    width: width - 1,
    borderTopLeftRadius: moderateScale(130),
    paddingTop: verticalScale(60),
    alignItems: 'center',
    paddingVertical: verticalScale(30),
    marginTop: -verticalScale(10),
  },
  welcomeText: {
    fontSize: moderateScale(30),
    color: Arctic,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'grey',
    fontSize: moderateScale(19),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
  },
  inputField: {
    height: verticalScale(40),
    width: '80%',
    borderBottomWidth: 1,
    borderColor: Arctic,
    color: Arctic,
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  errorText: {
    color: 'red',
    marginBottom: verticalScale(10),
  },
  forgotPassword: {
    alignItems: 'flex-end',
    width: '50%',
    paddingRight: moderateScale(16),
    marginBottom: verticalScale(100),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  signupText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  signupLink: {
    color: Arctic,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginLeft: moderateScale(5),
  },
});

export default Login;
