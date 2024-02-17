import init from "./src/init";
import { signInWithEmail, signUpWithEmail } from "./src/auth";
import {
  addExercise,
  addOwnedWorkouts,
  addSharedWorkouts,
  addWorkout,
  getExercise,
  getExercisesIds,
  getOwnedWorkoutsIds,
  getSharedWorkoutsIds,
  getWorkout,
  getWorkoutsIds,
} from "./src/workouts";

export {
  addExercise,
  addOwnedWorkouts,
  addSharedWorkouts,
  addWorkout,
  getExercise,
  getExercisesIds,
  getOwnedWorkoutsIds,
  getSharedWorkoutsIds,
  getWorkout,
  getWorkoutsIds,
  init,
  signInWithEmail,
  signUpWithEmail,
};
