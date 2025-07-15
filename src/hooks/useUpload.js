import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import APIs from '../api';

const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const uploadImage = async (uri) => {
    if (!uri) {
      setError('No image URI provided for upload.');
      return null;
    }
    setUploading(true);
    setFileUrl(null);

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: `photo_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const response = await APIs.upload.post('', formData);
      setFileUrl(response.data.url);
      return response.data.url;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const deleteImage = () => {
    setFileUrl(null);
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose an option to select your profile image",
      [
        {
          text: "Choose from Library",
          onPress: async () => {
            const image = await pickImage();
            if (image) {
              setFileUrl(image.uri);
            }
          },
        },
        {
          text: "Take Photo",
          onPress: async () => {
            const image = await takePhoto();
            if (image) {
              setFileUrl(image.uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return {
    uploading,
    error,
    fileUrl,
    uploadImage,
    deleteImage,
    showImagePickerOptions,
  };
};

export default useUpload;