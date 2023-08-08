import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Background from './Background';
import { Arctic, Sky } from './Constants';
import Field from './Field';
import Btn from './Btn';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const validEmail = 'user@example.com';
    const validPassword = 'password';

    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
    } else if (credentials.email === validEmail && credentials.password === validPassword) {
      setError('');
      Alert.alert('Logged In', 'You have successfully logged in.');
      props.navigation.navigate('AudioRecorder');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Background>
      <View style={{ alignItems: 'center', width: 460 }}>
        <Text style={{ color: 'white', fontSize: 64, fontWeight: 'bold', marginVertical: 10 }}>
          Login
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 40, color: Arctic, fontWeight: 'bold' }}>
            Welcome Back
          </Text>
          <Text style={{ color: 'grey', fontSize: 19, fontWeight: 'bold', marginBottom: 20 }}>
            Login to your account
          </Text>
          <Field
            placeholder="Email / Username"
            keyboardType="email-address"
            value={credentials.email}
            onChangeText={(text) => setCredentials({ ...credentials, email: text })}
          />
          <Field
            placeholder="Password"
            secureTextEntry={true}
            value={credentials.password}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <View style={{ alignItems: 'flex-end', width: '50%', paddingRight: 16, marginBottom: 100 }}>
            <Text style={{ color: Sky, fontWeight: 'bold', fontSize: 16 }}>
              Forgot Password?
            </Text>
          </View>
          <Btn
            textColor="white"
            bgColor={Arctic}
            btnLabel="Login"
            Press={handleLogin}
          />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
              <Text style={{ color: Arctic, fontWeight: 'bold', fontSize: 16 }}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Login;
