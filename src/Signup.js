import React from 'react';
import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import Background from './Background';
import { Arctic, Sky } from './Constants';
import Field from './Field';
import Btn from './Btn';


const Signup = (props) => {
  return (
    <Background>
    <View style={{ alignItems:"center", width: 460}}>
      <Text style={{ 
        color:"white", 
      fontSize: 64, 
      fontWeight: 'bold', 
      marginTop: 20, 
      }}>
      Register
      </Text>
      <Text 
      style={{ 
        color: "white", 
        fontSize: 16 
        }}>
        Create a new account
        </Text>
      <View 
      style={{ 
        backgroundColor: "white", 
      height: 700, width: 460, 
      borderTopLeftRadius: 130, 
      paddingTop: 100, 
      alignItems: 'center' 
      }}
      >
        <Field placeholder="First Name" />
        <Field placeholder="Last Name" />
        <Field placeholder="Email / Username" keyboardType={"email-address"} />
        <Field placeholder="Password" secureTextEntry={true} />
        <Field placeholder="Confirm Password" secureTextEntry={true} />
        <View style={{ display: 'flex', flexDirection: 'row', width: '50%', paddingRight: 16}}>
          <Text style={{ color: Sky, fontWeight: 'bold', font: 16 }}>
          By signing in, you agree to our{' '}
          </Text>
          <Text style={{ color: 'sky', fontSize: 16}}>
            Terms & Conditions
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", width: '78%', paddingRight: 16, marginBottom: 10}}>
          <Text style={{color: 'sky', fontSize: 16}}>
            and {""}
          </Text>
          <Text style={{ color: Arctic, fontWeight: 'bold', fontSize: 16}}>
            Privacy Policy
          </Text>
        </View>
        <Btn 
        textColor='white' 
        bgColor={Arctic} 
        btnLabel="Signup" Press={() => { alert ("Account created"); 
        props.navigation.navigate('Login')
        }} 
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent:
        "center"}}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
          <Text style={{ color: Arctic, fontWeight: 'bold', fontSize: 16 }}>
          Login
          </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Background>
  )
}

export default Signup;