import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { Exercise, Workout } from "../types/workouts";

async function getWorkoutsIds(): Promise<string[]> {
  const db = getFirestore();

  const snap = await getDocs(collection(db, "workouts"));
  return snap.docs.map((doc: any) => doc.id);
}

async function getExercisesIds(): Promise<string[]> {
  const db = getFirestore();

  const snap = await getDocs(collection(db, "exercises"));
  return snap.docs.map((doc: any) => doc.id);
}

async function getWorkout(id: string): Promise<Workout> {
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

async function getExercise(id: string): Promise<Exercise> {
  const db = getFirestore();

  const exerciseSnap = await getDoc(doc(db, "exercises", id));

  if (exerciseSnap.exists()) {
    const data = exerciseSnap.data();
    return {
      id: exerciseSnap.id,
      name: data.name,
      description: data.description,
      breakTime: data.breakTime,
      muscles: data.muscles,
      sets: data.sets,
    } as Exercise;
  } else {
    throw new Error("Document not found");
  }
}

async function addWorkout(workout: Workout): Promise<string> {
  const db = getFirestore();

  const exercises = [];
  for (const exercise of workout.exercises) {
    if (exercise.id) {
      exercises.push(doc(db, "exercises", exercise.id));
    } else {
      const exerciseId = await addExercise(exercise);
      exercises.push(doc(db, "exercise", exerciseId));
    }
  }

  const ref = doc(collection(db, "workouts"));
  await setDoc(ref, {
    name: workout.name,
    exercises,
  });

  return ref.id;
}

async function addExercise(exercise: Exercise): Promise<string> {
  const db = getFirestore();

  const ref = doc(collection(db, "exercises"));
  await setDoc(ref, {
    name: exercise.name,
    description: exercise.description,
    breakTime: exercise.breakTime,
    muscles: exercise.muscles,
    sets: exercise.sets,
  });

  return ref.id;
}

export {
  addExercise,
  addWorkout,
  getExercise,
  getExercisesIds,
  getWorkout,
  getWorkoutsIds,
};

async function ownWorkout(uid: string, id: string) {
  const db = getFirestore();

  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ownedWorkouts: [id],
  });
}

async function shareWorkout(uid: string, id: string) {
  const db = getFirestore();

  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    sharedWorkouts: [id],
  });
}

export { ownWorkout, shareWorkout };
