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

    const exercises = [];
    for (const exercise of data.exercises) {
      const exerciseData = await getExercise(exercise.id);
      exercises.push(exerciseData);
    }

    return {
      id: workoutSnap.id,
      name: data.name,
      exercises,
    } as Workout;
  } else {
    throw new Error("Document not found");
  }
}

async function getExercise(id: string) {
  const db = getFirestore();

  const exerciseSnap = await getDoc(doc(db, "exercises", id));

  if (exerciseSnap.exists()) {
    const data = exerciseSnap.data();
    return {
      id: exerciseSnap.id,
      name: data.name,
      description: data.description,
      muscles: data.muscles,
      sets: data.sets,
    } as Exercise;
  } else {
    throw new Error("Document not found");
  }
}

export { getExercise, getWorkout, getWorkoutsIds };
