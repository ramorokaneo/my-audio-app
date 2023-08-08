import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function AudioRecorder() {
  const [recording, setRecording] = useState(null);
  const [recordingsList, setRecordingsList] = useState([]);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    // Save the recorded audio file to the list
    setRecordingsList((prevList) => [...prevList, { uri }]);
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

  const renderRecordingItem = ({ item }) => (
    <TouchableOpacity onPress={() => deleteRecording(item)} style={styles.recordingItem}>
      <Text style={styles.recordingText}>{item.uri}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('./assets/beach.jpg')} style={styles.container}>
      <View style={styles.recordingsListContainer}>
        <FlatList
          data={recordingsList}
          renderItem={renderRecordingItem}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={<Text style={styles.emptyText}>No recordings yet.</Text>}
        />
      </View>
      <View style={styles.controlsContainer}>
        <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
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
  },
  recordingText: {
    fontSize: 16,
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
