import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showCompleteButton?: boolean;
  onCompletePress?: () => void;
  showWriteButton?: boolean;
  onWritePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showCompleteButton = false,
  onCompletePress,
  showWriteButton = false,
  onWritePress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 좌측 아이콘 */}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.leftIcon}>
            <Image source={require('../assets/back.png')} style={styles.backIcon} />
          </TouchableOpacity>
        )}

        {/* 중앙 제목 */}
        <Text style={styles.title}>{title}</Text>

        {/* 우측 버튼 */}
        {showCompleteButton && (
          <TouchableOpacity onPress={onCompletePress} style={styles.rightButton}>
            <Text style={styles.rightText}>완료</Text>
          </TouchableOpacity>
        )}
        {showWriteButton && (
          <TouchableOpacity onPress={onWritePress} style={styles.rightButton}>
            <Text style={styles.rightText}>글쓰기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none', 
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  rightButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  rightText: {
    fontSize: 16,
    color: '#FF5B35',
    fontWeight: '600',
  },
});