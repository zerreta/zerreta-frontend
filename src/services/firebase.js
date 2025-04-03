// Firebase configuration file
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push, query, orderByChild, limitToLast } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase project values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA1N_JVlVtdQtjS8JRFxwMrShY34yKAeJQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "neet-app-test.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://neet-app-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "neet-app-test",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "neet-app-test.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "915153921115",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:915153921115:web:1f6b7b7e7e7e7e7e7e7e7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Helper function to get current user ID
const getCurrentUserId = () => {
  // From the stored JWT token
  const userId = localStorage.getItem('userId') || 
                (localStorage.getItem('token') ? 
                  JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId : null);
  
  if (!userId) {
    console.error('No user ID found in localStorage');
  }
  
  return userId;
};

// Test History Functions
const testHistoryRef = (userId) => {
  return ref(database, `testHistory/${userId}`);
};

// Save test result to Firebase
const saveTestResult = async (testData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return null;
    
    // Create a new entry with push (generates unique ID)
    const newTestRef = push(testHistoryRef(userId));
    
    // Add timestamp and ensure testId exists
    const enhancedTestData = {
      ...testData,
      firebaseTimestamp: Date.now(),
      testId: testData._id || testData.testId || null,
      synced: true
    };
    
    // Set the data
    await set(newTestRef, enhancedTestData);
    console.log('Test result saved to Firebase:', newTestRef.key);
    
    return newTestRef.key;
  } catch (error) {
    console.error('Error saving test result to Firebase:', error);
    return null;
  }
};

// Get all test history for current user
const getAllTestHistory = async () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const snapshot = await get(testHistoryRef(userId));
    
    if (snapshot.exists()) {
      // Convert object to array and add the Firebase key
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        ...data[key],
        firebaseKey: key
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching test history from Firebase:', error);
    return [];
  }
};

// Listen for real-time updates to test history
const subscribeToTestHistory = (userId, callback) => {
  if (!userId) {
    userId = getCurrentUserId();
    if (!userId) return null;
  }
  
  console.log('Subscribing to test history for user:', userId);
  
  // Create a query to get the last 50 entries, ordered by timestamp
  const testsQuery = query(
    testHistoryRef(userId),
    orderByChild('firebaseTimestamp'),
    limitToLast(50)
  );
  
  // Set up the listener
  const unsubscribe = onValue(testsQuery, (snapshot) => {
    if (snapshot.exists()) {
      // Convert object to array and add the Firebase key
      const data = snapshot.val();
      const testHistory = Object.keys(data).map(key => ({
        ...data[key],
        firebaseKey: key
      }));
      
      // Sort by timestamp, newest first
      testHistory.sort((a, b) => b.firebaseTimestamp - a.firebaseTimestamp);
      
      callback(testHistory);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error subscribing to test history:', error);
    callback([]);
  });
  
  // Return the unsubscribe function to be called when component unmounts
  return unsubscribe;
};

// Function to sync MongoDB test history with Firebase
const syncTestHistoryWithFirebase = async (mongoDbTests) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    // Get existing Firebase tests
    const firebaseTests = await getAllTestHistory();
    
    // Create a map of testIds that already exist in Firebase
    const existingTestIds = new Set(firebaseTests.map(test => test.testId));
    
    // Filter MongoDB tests that don't exist in Firebase
    const testsToSync = mongoDbTests.filter(test => {
      const testId = test._id || test.testId;
      return testId && !existingTestIds.has(testId);
    });
    
    console.log(`Syncing ${testsToSync.length} tests to Firebase`);
    
    // Save each new test to Firebase
    for (const test of testsToSync) {
      await saveTestResult(test);
    }
    
    return testsToSync.length;
  } catch (error) {
    console.error('Error syncing test history with Firebase:', error);
    return 0;
  }
};

export {
  database,
  auth,
  saveTestResult,
  getAllTestHistory,
  subscribeToTestHistory,
  syncTestHistoryWithFirebase,
  getCurrentUserId
}; 