"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareWorkout = exports.ownWorkout = exports.getWorkoutsIds = exports.getWorkout = exports.getExercisesIds = exports.getExercise = exports.addWorkout = exports.addExercise = void 0;
const firestore_1 = require("firebase/firestore");
async function getWorkoutsIds() {
    const db = (0, firestore_1.getFirestore)();
    const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "workouts"));
    return snap.docs.map((doc) => doc.id);
}
exports.getWorkoutsIds = getWorkoutsIds;
async function getExercisesIds() {
    const db = (0, firestore_1.getFirestore)();
    const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "exercises"));
    return snap.docs.map((doc) => doc.id);
}
exports.getExercisesIds = getExercisesIds;
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
            breakTime: data.breakTime,
            muscles: data.muscles,
            sets: data.sets,
        };
    }
    else {
        throw new Error("Document not found");
    }
}
exports.getExercise = getExercise;
async function addWorkout(workout) {
    const db = (0, firestore_1.getFirestore)();
    const exercises = [];
    for (const exercise of workout.exercises) {
        if (exercise.id) {
            exercises.push((0, firestore_1.doc)(db, "exercises", exercise.id));
        }
        else {
            const exerciseId = await addExercise(exercise);
            exercises.push((0, firestore_1.doc)(db, "exercise", exerciseId));
        }
    }
    const ref = (0, firestore_1.doc)((0, firestore_1.collection)(db, "workouts"));
    await (0, firestore_1.setDoc)(ref, {
        name: workout.name,
        exercises,
    });
    return ref.id;
}
exports.addWorkout = addWorkout;
async function addExercise(exercise) {
    const db = (0, firestore_1.getFirestore)();
    const ref = (0, firestore_1.doc)((0, firestore_1.collection)(db, "exercises"));
    await (0, firestore_1.setDoc)(ref, {
        name: exercise.name,
        description: exercise.description,
        breakTime: exercise.breakTime,
        muscles: exercise.muscles,
        sets: exercise.sets,
    });
    return ref.id;
}
exports.addExercise = addExercise;
async function ownWorkout(uid, id) {
    const db = (0, firestore_1.getFirestore)();
    const ref = (0, firestore_1.doc)(db, "users", uid);
    await (0, firestore_1.updateDoc)(ref, {
        ownedWorkouts: [id],
    });
}
exports.ownWorkout = ownWorkout;
async function shareWorkout(uid, id) {
    const db = (0, firestore_1.getFirestore)();
    const ref = (0, firestore_1.doc)(db, "users", uid);
    await (0, firestore_1.updateDoc)(ref, {
        sharedWorkouts: [id],
    });
}
exports.shareWorkout = shareWorkout;
