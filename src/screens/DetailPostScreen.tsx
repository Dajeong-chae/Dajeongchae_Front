// ✅ DetailPostScreen.tsx (최종 버전)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import PoliteModal from '../components/PoliteModal';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';


interface PostDetail {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comment_count: number;
}

interface CommentItem {
  id: number;
  post_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  needs_review: boolean;
}

type DetailPostRouteProp = RouteProp<
  { params: { postId: number } },
  'params'
>;

// 날짜 포맷 유틸
const formatDate = (iso: string) => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatShortDate = (iso: string) => {
  const date = new Date(iso);
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const DetailPostScreen = () => {
  const route = useRoute<DetailPostRouteProp>();
  const { postId } = route.params;
  const navigation = useNavigation();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [politeComment, setPoliteComment] = useState('');

  const COMMENT_KEY = `comments_${postId}`;

  const fetchPost = async () => {
    const res = await fetch(`https://sweetspeech-api.onrender.com/posts/${postId}`);
    const data = await res.json();
    setPost(data);
  };

  const fetchComments = async () => {
    const res = await fetch(`https://sweetspeech-api.onrender.com/comments/${postId}`);
    const data = await res.json();
    const local = await AsyncStorage.getItem(COMMENT_KEY);
    const parsed = local ? JSON.parse(local) : [];
    setComments([...data, ...parsed]);
  };

  const saveCommentToStorage = async (comment: CommentItem) => {
    const existing = await AsyncStorage.getItem(COMMENT_KEY);
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [...parsed, comment];
    await AsyncStorage.setItem(COMMENT_KEY, JSON.stringify(updated));
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch('https://sweetspeech-api.onrender.com/comments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: commentText }),
      });
      const data = await res.json();
      console.log('✅ 응답:', res.status, data);

      if ('polite_comment' in data) {
        setPoliteComment(data.polite_comment);
        setModalVisible(true);
      } else {
        setCommentText('');
        await fetchComments();
      }
    } catch (err) {
      Alert.alert('댓글 등록 실패', '네트워크 오류');
    }
  };

  const handlePoliteConfirm = async () => {
    setModalVisible(false);

    const newComment: CommentItem = {
      id: Date.now(),
      post_id: postId,
      content: politeComment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      needs_review: false,
    };

    setComments((prev) => [...prev, newComment]);
    await saveCommentToStorage(newComment);
    setCommentText('');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPost();
      await fetchComments();
      setLoading(false);
    })();
  }, [postId]);

  if (loading || !post) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header title="전체 게시판" showBackButton onBackPress={() => navigation.goBack()} />

          <ScrollView contentContainerStyle={styles.contentWrapper} keyboardShouldPersistTaps="handled">
            {/* 게시글 영역 */}
            <View style={styles.postHeaderRow}>
              <Image source={require('../assets/user_icon.png')} style={styles.avatar} />
              <View style={styles.postTextColumn}>
                <Text style={styles.author}>익명</Text>
                <Text style={styles.dateBelow}>{formatShortDate(post.created_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>{post.title}</Text>
            {post.image_url && <Image source={{ uri: post.image_url }} style={styles.postImage} resizeMode="cover" />}            
            <Text style={styles.content}>{post.content}</Text>

            {/* 댓글 영역 */}
            <View style={styles.separator} />
            <View style={styles.commentHeaderContainer}>
              <Image source={require('../assets/chat_icon.png')} style={styles.chatIcon} resizeMode="contain" />
              <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
            </View>
            <View style={styles.separator} />

            {comments.length === 0 ? (
              <Text style={{ textAlign: 'center', paddingVertical: 16, color: '#999' }}>
                첫 댓글을 남겨주세요!
              </Text>
            ) : (
              comments.map((comment, idx) => (
                <View key={comment.id}>
                  <View style={styles.commentRow}>
                    <Image source={require('../assets/user_icon.png')} style={styles.avatar} />
                    <View style={styles.commentTextColumn}>
                      <Text style={styles.commentNickname}>익명{idx + 1}</Text>
                      {comment.needs_review ? (
                        <>
                          <Text style={styles.commentContentReview}>⚠️ {comment.content}</Text>
                        </>
                      ) : (
                        <Text style={styles.commentContent}>{comment.content}</Text>
                      )}
                    </View>
                    <Text style={styles.commentDate}>{formatDate(comment.created_at)}</Text>
                  </View>
                  <View style={styles.commentDivider} />
                </View>
              ))
            )}
          </ScrollView>

          {/* 댓글 입력창 */}
          <View style={styles.commentInputBar}>
            <TextInput
              style={styles.input}
              placeholder="댓글을 입력하세요."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor="#aaa"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleCommentSubmit}>
              <Text style={styles.sendButtonText}>입력</Text>
            </TouchableOpacity>
          </View>

          <PoliteModal
            visible={modalVisible}
            politeComment={politeComment}
            onCancel={() => setModalVisible(false)}
            onConfirm={handlePoliteConfirm}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default DetailPostScreen;

// ⚙️ Styles 생략: 기존 코드 유지

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  contentWrapper: { paddingHorizontal: 20, paddingBottom: 100 },
  postHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  postTextColumn: { flex: 1, marginRight: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  author: { fontSize: 12, fontWeight: '600', color: '#000' },
  dateBelow: { fontSize: 12, color: '#999', marginTop: 2 },
  title: { fontSize: 20, fontWeight: '500', marginBottom: 10 },
  postImage: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  content: { fontSize: 14, lineHeight: 20, color: '#333' },
  separator: { height: 1, backgroundColor: '#E0E0E0', width: '100%', marginVertical: 12 },
  commentHeaderContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  chatIcon: { width: 16, height: 16, tintColor: '#3A3A3A', marginRight: 6 },
  commentHeader: { fontSize: 15, fontWeight: '400', color: '#3A3A3A' },
  commentRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  commentDivider: { height: 1, backgroundColor: '#EEE', width: '100%', marginBottom: 12 },
  commentTextColumn: { flex: 1, marginRight: 8 },
  commentNickname: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  commentDate: { fontSize: 12, color: '#999', alignSelf: 'flex-end' },
  commentContent: { fontSize: 14, lineHeight: 20, color: '#333' },
  commentContentReview: { fontSize: 14, lineHeight: 20, color: '#FF5B35', fontStyle: 'italic'},
  commentInputBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, borderTopWidth: 1, borderColor: '#ddd', marginBottom: 13,
  },
  input: {
    flex: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, marginRight: 10, color: '#000', backgroundColor: '#F4F4F4',
  },
  sendButton: {
    backgroundColor: '#FF5B35', paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});