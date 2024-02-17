import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

async function signUpWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
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

  const auth = getAuth();

  if (!auth) {
    throw new Error("Internal server error");
  }

  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      throw new Error("Email address is already in use");
    }

    throw new Error(e.message);
  }
}

async function signInWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const auth = getAuth();

  if (!auth) {
    throw new Error("Internal server error");
  }

  try {
    return await signInWithEmailAndPassword(auth, email, password);
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

    throw new Error(e.message);
  }
}

export { signInWithEmail, signUpWithEmail };
