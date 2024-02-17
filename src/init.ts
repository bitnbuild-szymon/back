import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from "../firebase-config.json";

function init() {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  console.log("Firebase initialized");
  return { app, analytics };
}

export default init;
