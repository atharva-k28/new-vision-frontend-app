import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_BASE_URL='https://31fc-2401-4900-8fcb-9cfc-e597-2e01-5c29-6e35.ngrok-free.app'

const Home = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert(
        'Camera Permissions',
        'You need to grant camera permissions to use the app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant', onPress: () => requestPermission() }
        ]
      );
    }
  }, [permission]);

  const isPermissionReady = permission?.granted;

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
      setOutputText('');
    }
  };

  const request = async () => {
    if (!photo) return;
    setLoading(true);
    setError('');
    setOutputText('');

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photo,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(
        `${API_BASE_URL}/process-image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch caption');
      const res = await response.json();
      setOutputText(res.caption);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speak = () => {
    Speech.speak(outputText, { language: 'en-US' });
  };

  useEffect(() => {
    if (outputText) speak();
  }, [outputText]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {!isPermissionReady ? (
        <View style={styles.permissionPlaceholder}>
          <Text style={styles.text}>Waiting for permission...</Text>
        </View>
      ) : (
        <View style={styles.inner}>
          <Text style={styles.text}>Camera</Text>

          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.button} onPress={toggleFacing}>
                <Text>🔄 Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text>📸 Capture</Text>
              </TouchableOpacity>
            </View>
          </CameraView>

          {photo && (
            <Image
              source={{ uri: photo }}
              style={styles.imagePreview}
            />
          )}

          <TouchableOpacity
            onPress={request}
            disabled={loading || !photo}
            style={[
              styles.submitButton,
              { backgroundColor: loading || !photo ? '#999' : '#4CAF50' }
            ]}
          >
            <Text style={styles.submitText}>
              {loading ? 'Processing...' : 'Submit'}
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          {outputText && (
            <View style={styles.output}>
              <Text style={styles.captionTitle}>Caption:</Text>
              <Text style={styles.captionText}>{outputText}</Text>
              <TouchableOpacity onPress={speak} style={styles.speakBtn}>
                <Text style={styles.submitText}>🔊 Speak Again</Text>
              </TouchableOpacity>
            </View>
          )}

          
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // deeper blue-black
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: '#f8fafc',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#94a3b8',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imagePreview: {
    width: '100%',
    height: 280,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#f87171',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  output: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  captionTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
    color: '#e2e8f0',
  },
  captionText: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    textAlign: 'center',
    color: '#1e293b',
    fontSize: 15,
    marginBottom: 14,
    width: '100%',
  },
  speakBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
  },
  permissionPlaceholder: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
