import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

interface Props {
  visible: boolean;
  politeComment: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const PoliteModal = ({ visible, politeComment, onConfirm, onCancel }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={require('../assets/modalmark.png')} style={styles.icon} />
         <Text style={styles.title}>
        <Text style={{ color: '#FF5B35', fontWeight: 'bold' }}>악플</Text>이 탐지 됐어요.
        </Text>
        <Text style={[styles.subtext, { marginTop: 8 }]}>
        {politeComment} 
        {'\n'}
        <Text style={{ fontWeight: 'bold' }}>로 변경할까요?</Text>
        </Text>
          <Text style={styles.caution}>취소 시 댓글이 달리지 않습니다.</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PoliteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    width: 45,
    height: 45,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 15,
    textAlign: 'center',
    margin: 15,
  },
  caution: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  confirmBtn: {
    backgroundColor: '#FF5B35',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});