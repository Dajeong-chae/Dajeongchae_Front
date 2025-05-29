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
import Header from '../components/Header';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type DetailPostRouteProp = RouteProp<
  { params: { postId: number } },
  'params'
>;

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
}

const formatDate = (iso: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
};

const formatShortDate = (iso: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${mm}.${dd} ${hh}:${min}`;
};

const DetailPostScreen = () => {
  const route = useRoute<DetailPostRouteProp>();
  const { postId } = route.params;
  const navigation = useNavigation();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await fetch(`https://sweetspeech-api.onrender.com/posts/${postId}`);
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://sweetspeech-api.onrender.com/comments/${postId}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch('https://sweetspeech-api.onrender.com/comments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: commentText }),
      });
      if (res.ok) {
        setCommentText('');
        await fetchComments();
      } else {
        Alert.alert('댓글 등록 실패', '서버 응답 오류');
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      Alert.alert('네트워크 오류', '댓글을 등록할 수 없습니다.');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchPost();
      await fetchComments();
      setLoading(false);
    };
    load();
  }, [postId]);

  if (loading || !post) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header title="전체 게시판" showBackButton onBackPress={() => navigation.goBack()} />
          <ScrollView contentContainerStyle={styles.contentWrapper} keyboardShouldPersistTaps="handled">
            <View style={styles.postHeaderRow}>
              <Image source={require('../assets/user_icon.png')} style={styles.avatar} />
              <View style={styles.postTextColumn}>
                <Text style={styles.author}>익명</Text>
                <Text style={styles.dateBelow}>{formatShortDate(post.created_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>{post.title}</Text>

            {post.image_url && (
              <Image
                source={{ uri: post.image_url }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.content}>{post.content}</Text>

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
                      <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                    <Text style={styles.commentDate}>{formatDate(comment.created_at)}</Text>
                  </View>
                  <View style={styles.commentDivider} />
                </View>
              ))
            )}
          </ScrollView>
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  contentWrapper: { paddingHorizontal: 20, paddingBottom: 100 },
  postHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  postTextColumn: { flex: 1, marginRight: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  author: { fontSize: 12, fontWeight: '600', color: '#000' },
  dateBelow: { fontSize: 12, color: '#999', marginTop: 2 },
  title: { fontSize: 20, fontWeight: '500', marginBottom: 10 },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 12,
  },
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
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginBottom: 13,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 10,
    color: '#000',
    backgroundColor: '#F4F4F4',
  },
  sendButton: {
    backgroundColor: '#FF5B35',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

export default DetailPostScreen;