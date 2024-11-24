import { 
  collection,
  addDoc,
  query,
  getDocs,
  where,
  GeoPoint,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AccessibilityFeature } from '../types/AccessibilityFeature';

const FEATURES_COLLECTION = 'accessibility_features';

export const addAccessibilityFeature = async (feature: Omit<AccessibilityFeature, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, FEATURES_COLLECTION), {
      ...feature,
      location: new GeoPoint(feature.latitude, feature.longitude),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding accessibility feature:', error);
    throw error;
  }
};

export const getNearbyFeatures = async (latitude: number, longitude: number, radiusInKm: number) => {
  try {
    // For simplicity, we're just getting all features
    // In a production app, you'd want to implement proper geospatial queries
    const featuresRef = collection(db, FEATURES_COLLECTION);
    const snapshot = await getDocs(featuresRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AccessibilityFeature[];
  } catch (error) {
    console.error('Error getting nearby features:', error);
    throw error;
  }
};

export const getFeaturesByType = async (type: AccessibilityFeature['type']) => {
  try {
    const featuresRef = collection(db, FEATURES_COLLECTION);
    const q = query(featuresRef, where('type', '==', type));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AccessibilityFeature[];
  } catch (error) {
    console.error('Error getting features by type:', error);
    throw error;
  }
};
