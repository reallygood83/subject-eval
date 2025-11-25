import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

/**
 * Google 로그인
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Firestore에 사용자 정보 저장/업데이트
    await saveUserToFirestore(user);

    return user;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

/**
 * Firestore에 사용자 정보 저장
 */
const saveUserToFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);

  try {
    const userDoc = await getDoc(userRef);

    const userData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: new Date(),
    };

    if (!userDoc.exists()) {
      // 새 사용자 - createdAt 추가
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
      });
    } else {
      // 기존 사용자 - lastLoginAt만 업데이트
      await setDoc(userRef, userData, { merge: true });
    }
  } catch (error) {
    console.error('사용자 정보 저장 오류:', error);
    throw error;
  }
};

/**
 * 인증 상태 변경 리스너
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
