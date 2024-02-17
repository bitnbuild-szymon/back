import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import { Exercise, Workout } from "../types/workouts";

async function getWorkoutsIds() {
  const db = getFirestore();

  const snap = await getDocs(collection(db, "workouts"));
  return snap.docs.map((doc: any) => doc.id);
}

async function getWorkout(id: string) {
  const db = getFirestore();

  const workoutSnap = await getDoc(doc(db, "workouts", id));

  if (workoutSnap.exists()) {
    const data = workoutSnap.data();
    const exercisesSnap = await getDoc(data.exercises[0]);

    return {
      id: workoutSnap.id,
      name: data.name,
      exercises:
        (exercisesSnap.exists() ? exercisesSnap.data() : []) as Exercise[],
    } as Workout;
  } else {
    throw new Error("Document not found");
  }
}

export { getWorkout, getWorkoutsIds };
