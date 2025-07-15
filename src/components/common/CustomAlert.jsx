import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CustomAlert = ({ isVisible, title, message, type = 'success', onFinish, onConfirm, onCancel }) => {
  useEffect(() => {
    let timer;
    if (isVisible && type !== 'confirm') {
      timer = setTimeout(() => {
        onFinish();
      }, 3000); // Auto-dismiss after 3 seconds for success/error
    }
    return () => clearTimeout(timer);
  }, [isVisible, onFinish, type]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <AntDesign name="checkcircleo" size={50} color="green" style={styles.icon} />;
      case 'error':
        return <AntDesign name="closecircleo" size={50} color="red" style={styles.icon} />;
      case 'confirm':
        return <AntDesign name="questioncircleo" size={50} color="orange" style={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={type === 'confirm' ? onCancel : onFinish}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {type !== 'confirm' && (
            <TouchableOpacity style={styles.closeButton} onPress={onFinish}>
              <AntDesign name="closecircleo" size={24} color="#999" />
            </TouchableOpacity>
          )}
          {getIcon()}
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          {type === 'confirm' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.buttonText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                <Text style={styles.buttonText}>Ya</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.okButton]} onPress={onFinish}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  icon: {
    marginBottom: 15,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomAlert;
