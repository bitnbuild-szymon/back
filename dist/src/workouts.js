"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutsIds = exports.getWorkout = exports.getExercise = void 0;
const firestore_1 = require("firebase/firestore");
async function getWorkoutsIds() {
    const db = (0, firestore_1.getFirestore)();
    const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "workouts"));
    return snap.docs.map((doc) => doc.id);
}
exports.getWorkoutsIds = getWorkoutsIds;
async function getWorkout(id) {
    const db = (0, firestore_1.getFirestore)();
    const workoutSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "workouts", id));
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
        };
    }
    else {
        throw new Error("Document not found");
    }
}
exports.getWorkout = getWorkout;
async function getExercise(id) {
    const db = (0, firestore_1.getFirestore)();
    const exerciseSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, "exercises", id));
    if (exerciseSnap.exists()) {
        const data = exerciseSnap.data();
        return {
            id: exerciseSnap.id,
            name: data.name,
            description: data.description,
            muscles: data.muscles,
            sets: data.sets,
        };
    }
    else {
        throw new Error("Document not found");
    }
}
exports.getExercise = getExercise;
