"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendsIds = exports.addFriend = exports.getUsersIds = exports.getUser = exports.signUpWithEmail = exports.signInWithEmail = void 0;
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
async function signUpWithEmail(email, password, username) {
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
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email address");
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
        if (e.code === "auth/invalid-email") {
            throw new Error("Invalid email address");
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
async function getUsersIds() {
    const db = (0, firestore_1.getFirestore)();
    const users = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "users"));
    return users.docs.map((doc) => doc.id);
}
exports.getUsersIds = getUsersIds;
async function getUser(uid) {
    const db = (0, firestore_1.getFirestore)();
    const user = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "users", uid));
    if (user.exists()) {
        const data = user.data();
        return {
            id: user.id,
            username: data.username,
        };
    }
    else {
        throw new Error("User not found");
    }
}
exports.getUser = getUser;
async function getFriendsIds(uid) {
    const db = (0, firestore_1.getFirestore)();
    const userSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "users", uid));
    const data = userSnap.data();
    return (data === null || data === void 0 ? void 0 : data.friends) || [];
}
exports.getFriendsIds = getFriendsIds;
async function addFriend(uid, friendId) {
    const db = (0, firestore_1.getFirestore)();
    const friends = await getFriendsIds(uid);
    const os = new Set(friends);
    os.add(friendId);
    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, "users", uid), {
        friends: [...os],
    });
}
exports.addFriend = addFriend;
