import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from './Background';
import { Arctic, Sky } from './Constants';
import Field from './Field';
import Btn from './Btn';

const Signup = (props) => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const saveUserInformation = async (userDetails) => {
    try {
      const jsonValue = JSON.stringify(userDetails);
      await AsyncStorage.setItem('userDetails', jsonValue);
    } catch (error) {
      console.error('Error saving user information:', error);
    }
  };

  const handleSignup = () => {
    const { firstName, lastName, email, password, confirmPassword } = userDetails;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all the fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      Alert.alert('Account Created', 'Your account has been successfully created.');
      // Save the user's information
      saveUserInformation(userDetails);
      props.navigation.navigate('Login');
    }
  };

  return (
    <Background>
      <View style={{ alignItems: 'center', width: 460 }}>
        <Text style={{ color: 'white', fontSize: 64, fontWeight: 'bold', marginTop: 20 }}>
          Register
        </Text>
        <Text style={{ color: 'white', fontSize: 16 }}>Create a new account</Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: 'center',
          }}>
          <Field placeholder="First Name" value={userDetails.firstName} onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })} />
          <Field placeholder="Last Name" value={userDetails.lastName} onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })} />
          <Field placeholder="Email / Username" keyboardType="email-address" value={userDetails.email} onChangeText={(text) => setUserDetails({ ...userDetails, email: text })} />
          <Field placeholder="Password" secureTextEntry value={userDetails.password} onChangeText={(text) => setUserDetails({ ...userDetails, password: text })} />
          <Field
            placeholder="Confirm Password"
            secureTextEntry
            value={userDetails.confirmPassword}
            onChangeText={(text) => setUserDetails({ ...userDetails, confirmPassword: text })}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <View style={{ display: 'flex', flexDirection: 'row', width: '50%', paddingRight: 16 }}>
            <Text style={{ color: Sky, fontWeight: 'bold', fontSize: 16 }}>
              By signing in, you agree to our{' '}
            </Text>
            <Text style={{ color: 'sky', fontSize: 16 }}>Terms & Conditions</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '78%', paddingRight: 16, marginBottom: 10 }}>
            <Text style={{ color: 'sky', fontSize: 16 }}>and {''}</Text>
            <Text style={{ color: Arctic, fontWeight: 'bold', fontSize: 16 }}>Privacy Policy</Text>
          </View>
          <Btn textColor="white" bgColor={Arctic} btnLabel="Signup" Press={handleSignup} />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Already have an account ?</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
              <Text style={{ color: Arctic, fontWeight: 'bold', fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Signup;
