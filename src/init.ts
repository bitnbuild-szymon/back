import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

import firebaseConfig from "../firebase-config.json";

function init() {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialized");

  if (isSupported()) {
    const analytics = getAnalytics(app);
    console.log("Firebase analytics initialized");

    return { app, analytics };
  }

  return { app, analytics: null };
}

export default init;
