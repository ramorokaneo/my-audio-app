import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ImageBackground, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function AudioRecorder() {
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

      // Configure recording options based on the platform
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
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      // Save the recorded audio file with date and time to the list
      const currentDate = new Date();
      const recordingData = { uri, date: currentDate.toLocaleDateString(), time: currentDate.toLocaleTimeString() };
      setRecordingsList((prevList) => [...prevList, recordingData]);
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
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>Recording {item.index + 1}</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Play" onPress={() => playSound(item)} />
        <Button title="Delete" onPress={() => deleteRecording(item)} />
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/beach.jpg')} style={styles.container}>
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
          <Button title="Stop Recording" onPress={stopRecording} />
        ) : (
          <Button title="Start Recording" onPress={startRecording} />
        )}
        {sound && (
          <Button title="Stop Playback" onPress={stopSound} />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  recordingsListContainer: {
    flex: 1,
  },
  recordingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  emptyText: {
    fontSize: 16,
    alignSelf: 'center',
    marginVertical: 20,
  },
  controlsContainer: {
    marginBottom: 20,
  },
});
