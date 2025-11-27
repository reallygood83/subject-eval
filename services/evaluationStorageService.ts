import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { EvaluationData } from '../types';

export interface SavedEvaluation {
  id: string;
  userId: string;
  fileName: string;
  evaluationData: EvaluationData;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'evaluations';

/**
 * 분석 결과를 Firebase에 저장
 */
export const saveEvaluationData = async (
  userId: string,
  fileName: string,
  evaluationData: EvaluationData
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      fileName,
      evaluationData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving evaluation data:', error);
    throw new Error('분석 결과 저장에 실패했습니다.');
  }
};

/**
 * 사용자의 저장된 분석 결과 목록 가져오기
 */
export const getSavedEvaluations = async (userId: string): Promise<SavedEvaluation[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const evaluations: SavedEvaluation[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations.push({
        id: doc.id,
        userId: data.userId,
        fileName: data.fileName,
        evaluationData: data.evaluationData as EvaluationData,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });

    return evaluations;
  } catch (error) {
    console.error('Error getting saved evaluations:', error);
    throw new Error('저장된 분석 결과를 불러오는데 실패했습니다.');
  }
};

/**
 * 특정 분석 결과 가져오기
 */
export const getEvaluationById = async (evaluationId: string): Promise<SavedEvaluation | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, evaluationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        fileName: data.fileName,
        evaluationData: data.evaluationData as EvaluationData,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting evaluation by ID:', error);
    throw new Error('분석 결과를 불러오는데 실패했습니다.');
  }
};

/**
 * 저장된 분석 결과 삭제
 */
export const deleteEvaluation = async (evaluationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, evaluationId));
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    throw new Error('분석 결과 삭제에 실패했습니다.');
  }
};
