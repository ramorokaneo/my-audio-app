import { StatusBar, Platform, Alert } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = React.useState(null);
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState('');

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recordingObject = new Audio.Recording();
        await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);

        setRecording(recordingObject);

        await recordingObject.startAsync();
      } else {
        setMessage('Please grant permission to access the microphone');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      let updatedRecordings = [...recordings];
      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });

      setRecordings(updatedRecordings);
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  function getDurationFormatted(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  async function playSound(sound) {
    try {
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  }

  async function deleteRecording(index) {
    try {
      const recordingLine = recordings[index];
      await recordingLine.sound.unloadAsync();

      let updatedRecordings = [...recordings];
      updatedRecordings.splice(index, 1);
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error('Failed to delete recording', error);
    }
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            onPress={() => playSound(recordingLine.sound)}
            title="Play"
          />
          <Button
            onPress={() => deleteRecording(index)}
            title="Delete"
          />
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});