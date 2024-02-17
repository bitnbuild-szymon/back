import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

import firebaseConfig from "../configs/firebase-config.json";

async function init() {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialized");

  const db = getFirestore(app);
  console.log("Firebase firestore initialized");

  if (await isSupported()) {
    const analytics = getAnalytics(app);
    console.log("Firebase analytics initialized");

    return { app, db, analytics };
  }

  return { app, db, analytics: null };
}

export default init;
