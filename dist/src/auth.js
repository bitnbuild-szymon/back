"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpWithEmail = exports.signInWithEmail = void 0;
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
async function signUpWithEmail(email, password, username) {
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
    // Validate username
    if (!username) {
        throw new Error("Username is required");
    }
    if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
    }
    if (username.length > 20) {
        throw new Error("Username must be at most 20 characters");
    }
    const auth = (0, auth_1.getAuth)();
    if (!auth) {
        throw new Error("Internal server error");
    }
    try {
        const firebaseUser = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
        const userProfile = {
            id: firebaseUser.user.uid,
            email,
            username,
        };
        await createProfile(firebaseUser.user.uid, userProfile);
        return {
            firebaseUser,
            userProfile,
        };
    }
    catch (e) {
        if (e.code === "auth/email-already-in-use") {
            throw new Error("Email address is already in use");
        }
        throw new Error(e.message);
    }
}
exports.signUpWithEmail = signUpWithEmail;
async function signInWithEmail(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const auth = (0, auth_1.getAuth)();
    if (!auth) {
        throw new Error("Internal server error");
    }
    try {
        const firebaseUser = await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
        const userProfile = await getProfile(firebaseUser.user.uid);
        return {
            firebaseUser,
            userProfile,
        };
    }
    catch (e) {
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
exports.signInWithEmail = signInWithEmail;
async function createProfile(uid, user) {
    const db = (0, firestore_1.getFirestore)();
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "users", uid), {
        username: user.username,
    });
}
async function getProfile(uid) {
    const db = (0, firestore_1.getFirestore)();
    const userSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "users", uid));
    const data = userSnap.data();
    return {
        id: userSnap.id,
        email: data.email,
        username: data.username,
    };
}
