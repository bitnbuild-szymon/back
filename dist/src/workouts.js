"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutsIds = exports.getWorkout = void 0;
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
        const exercisesSnap = await (0, firestore_1.getDoc)(data.exercises[0]);
        return {
            id: workoutSnap.id,
            name: data.name,
            exercises: (exercisesSnap.exists() ? exercisesSnap.data() : []),
        };
    }
    else {
        throw new Error("Document not found");
    }
}
exports.getWorkout = getWorkout;
