import { StatusBar, Platform, Alert } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import Background from './Background';
import Btn from './Btn';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState('');
  const recordingTimer = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundObject = useRef(null);

  useEffect(() => {
    return () => {
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
    };
  }, []);

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
        recordingTimer.current = setInterval(() => {
          setDuration((prevDuration) => prevDuration + 1);
        }, 1000);
        setMessage('Recording...');
      } else {
        setMessage('Please grant permission to access the microphone');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
      clearInterval(recordingTimer.current);
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
      setDuration(0);
      setMessage('');
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  function getDurationFormatted(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  async function playSound(soundUri) {
    if (!soundUri) {
      console.error('Invalid soundUri: ', soundUri);
      return;
    }

    try {
      setIsPlaying(true);

      if (soundObject.current) {
        await soundObject.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
      soundObject.current = sound;

      await soundObject.current.playAsync();
      soundObject.current.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to play sound', error);
      setIsPlaying(false);
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
          <Btn
            textColor="white"
            bgColor="#007AFF"
            btnLabel="Play"
            Press={() => playSound(recordingLine.file)}
          />
          <Btn
            textColor="white"
            bgColor="#FF3B30"
            btnLabel="Delete"
            Press={() => deleteRecording(index)}
          />
        </View>
      );
    });
  }

  return (
    <Background>
      <View style={styles.container}>
        <Text>{message}</Text>
        <Text style={styles.durationText}>
          {recording ? `Recording Time: ${getDurationFormatted(duration * 1000)}` : ''}
        </Text>
        <Btn
          textColor="white"
          bgColor={recording ? '#FF3B30' : '#007AFF'}
          btnLabel={recording ? 'Stop Recording' : 'Start Recording'}
          Press={recording ? stopRecording : startRecording}
        />
        {getRecordingLines()}
        <StatusBar style="auto" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  durationText: {
    fontSize: 18,
    marginVertical: 8,
    color: 'white',
  },
});
