import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { AudioRecorderPlayer, AudioEncoderAndroid, AudioSourceAndroid } from 'react-native-audio-recorder-player';
import { request, PERMISSIONS } from 'react-native-permissions';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const startRecording = async () => {
    try {
      await requestPermission();
      const path = 'your_audio_file.mp3';
      await audioRecorderPlayer.startRecorder(path, {
        // You can set recording options here
        // For example: sampleRate: 44100, channels: 1, bitsPerSample: 16
        encoder: AudioEncoderAndroid.AAC,
        AudioSource: AudioSourceAndroid.MIC,
      });
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording: ', err);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log('Recording stopped, audio file saved at: ', result);
    } catch (err) {
      console.error('Failed to stop recording: ', err);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Record audio permission granted');
      } else {
        console.log('Record audio permission denied');
      }
    } catch (err) {
      console.error('Failed to request record audio permission: ', err);
    }
  };

  return (
    <View>
      <Text>{isRecording ? 'Recording...' : 'Press button to start recording'}</Text>
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
        <Text>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioRecorder;
