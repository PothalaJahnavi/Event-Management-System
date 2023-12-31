import { initializeApp } from "firebase/app";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import {
  runTransaction,
  getFirestore,
  collection,
  addDoc,
  getDoc,
  setDoc,
  doc,
  arrayUnion,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVYotag73rGtqPNXLT_l-ZKnzIQryQrFA",
  authDomain: "event-management-system-80166.firebaseapp.com",
  projectId: "event-management-system-80166",
  storageBucket: "event-management-system-80166.appspot.com",
  messagingSenderId: "630519740570",
  appId: "1:630519740570:web:32b1fe2bfe573a52584723",
  databaseURL:
    "https://event-management-system-80166-default-rtdb.firebaseio.com/",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const database = getDatabase(app);
const FirebaseContext = createContext(null);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseProvider = (props) => {
  const [currentRole, setCurrentRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoggedIn(true);
        const fetchData=async()=>{
          const userData = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userData);
          if (userDoc.exists()) {
            setCurrentRole('user')
          }
          else{
            setCurrentRole('admin')
          }
        } 
        fetchData()

      } else {
        setCurrentUser(null);
        setLoggedIn(false);
      }
    });
    console.log(
      "isloggedin",
      loggedIn,
      "isrole",
      currentRole,
      "isuser",
      currentUser
    );
  });
  const register = async (name, email, password, role) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await updateProfile(res.user, { displayName: name });
      if (role == "user") {
        const userRef = doc(firestore, "users", res.user.uid);
        await setDoc(userRef, { name, email, role });
      } else {
        const adminRef = doc(firestore, "admins", res.user.uid);
        await setDoc(adminRef, { name, email, role });
      }
      return res;
    } catch (err) {
      return err;
    }
  };

  const login = async (email, password, role) => {
    try {
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (role == "user") setCurrentRole("user");
      else setCurrentRole("admin");
      return res;
    } catch (err) {
      return err;
    }
  };

  const createEvent = async (name, desc, time) => {
    try {
      const res = await addDoc(collection(firestore, "events"), {
        name,
        desc,
        time,
        adminId: currentUser?.uid,
        participants: 0,
      });
      if (res) {
      }
      return res;
    } catch (err) {
      return err;
    }
  };

  const AllEvents = async () => {
    try {
      const result = await getDocs(collection(firestore, "events"));
      return result;
    } catch (err) {
      return err;
    }
  };

  const AdminEvents = async () => {
    try {
      const q = query(
        collection(firestore, "events"),
        where("adminId", "==", currentUser.uid)
      );
      const result = await getDocs(q);
      return result;
    } catch (err) {
      return err;
    }
  };

  const getEventById = async (eventId) => {
    try {
      const eventRef = doc(firestore, "events", eventId);
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        return { id: eventId, ...eventData };
      } else {
        return null;
      }
    } catch (err) {
      return err;
    }
  };

  const EditEvent = async (eventId, name, desc, time) => {
    const eventData = doc(firestore, "events", eventId);
    if (eventData) {
      await updateDoc(eventData, {
        name: name,
        desc: desc,
        time: time,
      });
      return true;
    } else {
      return false;
    }
  };

  const participteInEvent = async (userId, eventId) => {
    try {
      // Run Firestore transaction for atomic updates
      const result = await runTransaction(firestore, async (transaction) => {
        const userRef = doc(firestore, "users", userId);
        const eventRef = doc(firestore, "events", eventId);
  
        const userDoc = await transaction.get(userRef);
        const eventDoc = await transaction.get(eventRef);
  
        if (!userDoc.exists()) {
          throw new Error("User not found");
        }
  
        if (!eventDoc.exists()) {
          throw new Error("Event not found");
        }
  
        // Update user document
        transaction.update(userRef, {
          participated: arrayUnion(eventId),
        });
  
        // Update event document
        transaction.update(eventRef, {
          participants: eventDoc.data().participants + 1,
        });
  
        return eventRef;
      });
  
      return result;
    } catch (error) {
      console.error("Error participating in event:", error.message);
      throw error; // Rethrow the error for the caller to handle
    }
  };
  

  const UserEvents = async () => {
    try {
      const participatedEvents = [];
      const userRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const eventPromises = userData?.participated?.map((item) => getEventById(item));
  
        if (eventPromises) {
          // Use Promise.all to concurrently resolve all promises
          const eventResults = await Promise.all(eventPromises);
          participatedEvents.push(...eventResults);
          return participatedEvents;
        } else {
          console.log("No participated events found");
          return [];
        }
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };
  

  return (
    <FirebaseContext.Provider
      value={{
        register,
        login,
        createEvent,
        AllEvents,
        AdminEvents,
        getEventById,
        EditEvent,
        participteInEvent,
        UserEvents,
        currentUser,
        currentRole,
        loggedIn,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
