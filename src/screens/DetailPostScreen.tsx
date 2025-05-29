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
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
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
        await fetchComments(); // 댓글 새로고침
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
    <View style={styles.container}>
      <Header title="게시글" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <View style={styles.authorSection}>
          <Text style={styles.nickname}>작성일</Text>
          <Text style={styles.date}>{formatDate(post.created_at)}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글 ({comments.length})</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <View style={styles.commentTextColumn}>
                <Text style={styles.commentNickname}>익명</Text>
                <Text style={styles.commentDate}>{formatDate(comment.created_at)}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            </View>
          ))}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.input}
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleCommentSubmit}>
              <Text style={styles.submit}>입력</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailPostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  contentWrapper: { padding: 20 },
  authorSection: { marginBottom: 16 },
  nickname: { fontSize: 16, fontWeight: '500', color: '#000' },
  date: { fontSize: 12, color: '#666', marginTop: 2 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  content: { fontSize: 14, lineHeight: 24, marginBottom: 20 },
  commentSection: { marginTop: 10 },
  commentHeader: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  commentRow: { marginBottom: 12 },
  commentTextColumn: { flex: 1 },
  commentNickname: { fontSize: 14, fontWeight: '500', color: '#000' },
  commentDate: { fontSize: 12, color: '#666' },
  commentContent: { fontSize: 14, marginTop: 4, color: '#000' },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
  },
  submit: {
    fontSize: 14,
    color: '#408A21',
    fontWeight: '600',
  },
});