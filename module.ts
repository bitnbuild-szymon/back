import init from "./src/init";
import {
  addFriend,
  getFriendsIds,
  getUser,
  getUsersIds,
  signInWithEmail,
  signUpWithEmail,
} from "./src/auth";
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
import { getRandomQuote } from "./src/quotes";

export {
  addExercise,
  addFriend,
  addOwnedWorkouts,
  addSharedWorkouts,
  addWorkout,
  getExercise,
  getExercisesIds,
  getFriendsIds,
  getOwnedWorkoutsIds,
  getRandomQuote,
  getSharedWorkoutsIds,
  getUser,
  getUsersIds,
  getWorkout,
  getWorkoutsIds,
  init,
  signInWithEmail,
  signUpWithEmail,
};
