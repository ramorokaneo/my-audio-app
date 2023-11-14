import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ImageBackground, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function AudioRecorder({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [recordingsList, setRecordingsList] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      // Unload the sound when the component unmounts to avoid memory leaks
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error('Audio recording permissions not granted.');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        allowsRecordingAndroid: true,
        playsInSilentModeAndroid: true,
      });

      console.log('Starting recording..');

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err.message);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    try {
      if (!recording) {
        throw new Error('No active recording found.');
      }

      setRecording(null);
      await recording.stopAndUnloadAsync();

      const status = await recording.getStatusAsync();
      const duration = Math.floor(status.durationMillis / 1000);

      const currentDate = new Date();
      const recordingData = {
        uri: recording.getURI(),
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
        duration,
      };
      setRecordingsList((prevList) => [...prevList, recordingData]);
      console.log('Recording stopped and stored at', recordingData.uri);
    } catch (err) {
      console.error('Failed to stop recording:', err.message);
    }
  }

  async function deleteRecording(item) {
    try {
      await FileSystem.deleteAsync(item.uri);
      setRecordingsList((prevList) => prevList.filter((rec) => rec.uri !== item.uri));
      console.log('Recording deleted:', item.uri);
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  }

  async function playSound(item) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: item.uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Failed to stop sound:', error);
    }
  };

  const renderRecordingItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.recordingText}>Recording {item.index + 1}</Text>
      <Text style={styles.recordingDetails}>
        {`Date: ${item.date}\nTime: ${item.time}\nDuration: ${formatDuration(item.duration)}`}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => playSound(item)}>
          <Ionicons name="ios-play-circle" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => deleteRecording(item)}>
          <Ionicons name="ios-trash" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // You can add your logout logic here
            navigation.navigate('Login'); // Assuming you have a 'Login' screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={require('./assets/beach.jpg')} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Audio Recorder</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.recordingsListContainer}>
        <FlatList
          data={recordingsList.map((item, index) => ({ ...item, index }))}
          renderItem={renderRecordingItem}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={<Text style={styles.emptyText}>No recordings yet.</Text>}
        />
      </View>
      <View style={styles.controlsContainer}>
        {recording ? (
          <TouchableOpacity style={styles.recordButton} onPress={stopRecording}>
            <Ionicons name="ios-stop-circle" size={60} color="#e74c3c" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Ionicons name="ios-microphone" size={60} color="#3498db" />
          </TouchableOpacity>
        )}
        {sound && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
            <Ionicons name="ios-square" size={60} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
  },
  recordingsListContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  recordingText: {
    fontSize: 16,
  },
  recordingDetails: {
    fontSize: 14,
    marginTop: 5,
    color: '#333', // Adjust the color as needed
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconContainer: {
    marginHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    alignSelf: 'center',
    marginVertical: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 50,
    padding: 15,
  },
  stopButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderRadius: 50,
    padding: 15,
  },
});
