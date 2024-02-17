import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { UserProfile } from "../types/auth";

async function signUpWithEmail(
  email: string,
  password: string,
  username: string,
): Promise<{
  firebaseUser: any;
  userProfile: UserProfile;
}> {
  if (!email || !password || !username) {
    throw new Error("Email, password and username are required");
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  // Validate password
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password must contain a number");
  }
  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain a lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain an uppercase letter");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw new Error("Password must contain a special character");
  }

  // Validate username
  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }
  if (username.length > 20) {
    throw new Error("Username must be at most 20 characters");
  }

  const auth = getAuth();

  if (!auth) {
    throw new Error("Internal server error");
  }

  try {
    const firebaseUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userProfile = {
      id: firebaseUser.user.uid,
      email,
      username,
      ownedWorkouts: [],
      sharedWorkouts: [],
      friends: [],
    };
    await createProfile(firebaseUser.user.uid, userProfile);

    return {
      firebaseUser,
      userProfile,
    };
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      throw new Error("Email address is already in use");
    }

    throw new Error(e.message);
  }
}

async function signInWithEmail(email: string, password: string): Promise<{
  firebaseUser: any;
  userProfile: UserProfile;
}> {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  const auth = getAuth();

  if (!auth) {
    throw new Error("Internal server error");
  }

  try {
    const firebaseUser = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userProfile = await getProfile(firebaseUser.user.uid);

    return {
      firebaseUser,
      userProfile,
    };
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      throw new Error("No user found with this email address");
    }
    if (e.code === "auth/invalid-credential") {
      throw new Error("Invalid email address or password");
    }
    if (e.code === "auth/too-many-requests") {
      throw new Error("Too many requests. Try again later");
    }
    if (e.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    }

    throw new Error(e.message);
  }
}

async function createProfile(
  uid: string,
  user: UserProfile,
) {
  const db = getFirestore();

  await setDoc(doc(db, "users", uid), {
    username: user.username,
  });
}
async function getProfile(uid: string): Promise<UserProfile> {
  const db = getFirestore();

  const userSnap = await getDoc(doc(db, "users", uid));

  const data = userSnap.data();
  return {
    id: userSnap.id,
    email: data!.email,
    username: data!.username,
    ownedWorkouts: data!.ownedWorkouts,
    sharedWorkouts: data!.sharedWorkouts,
    friends: data!.friends,
  } as UserProfile;
}

export { signInWithEmail, signUpWithEmail };

async function getUsersIds(): Promise<string[]> {
  const db = getFirestore();

  const users = await getDocs(collection(db, "users"));
  return users.docs.map((doc: any) => doc.id);
}
async function getUser(uid: string): Promise<UserProfile> {
  const db = getFirestore();

  const user = await getDoc(doc(db, "users", uid));

  if (user.exists()) {
    const data = user.data();
    return {
      id: user.id,
      username: data.username,
      friends: data.friends,
    } as UserProfile;
  } else {
    throw new Error("User not found");
  }
}

export { getUser, getUsersIds };

async function getFriendsIds(uid: string): Promise<string[]> {
  const db = getFirestore();

  const userSnap = await getDoc(doc(db, "users", uid));
  const data = userSnap.data();

  return data?.friends || [];
}
async function addFriend(uid: string, friendId: string) {
  const db = getFirestore();

  const friends = await getFriendsIds(uid);
  const os = new Set(friends);
  os.add(friendId);

  await updateDoc(doc(db, "users", uid), {
    friends: [...os],
  });
}

export { addFriend, getFriendsIds };
