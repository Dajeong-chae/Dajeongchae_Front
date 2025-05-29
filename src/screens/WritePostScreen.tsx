import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const WritePostScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('https://sweetspeech-api.onrender.com/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        Alert.alert('성공', '게시글이 등록되었습니다.');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('서버 응답 오류:', errorData);
        Alert.alert('실패', '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="글쓰기"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showCompleteButton
        onCompletePress={handleSubmit}
      />

      <View style={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="제목"
          placeholderTextColor="#000"
        />
        <View style={styles.separator} />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="내용"
          placeholderTextColor="#aaa"
          multiline
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default WritePostScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 15,
    textAlignVertical: 'top',
    color: '#000',
    height: 200,
  },
});