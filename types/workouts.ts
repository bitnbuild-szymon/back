export interface Workout {
  id?: string;
  name: string;
  exercises: Exercise[];
}

// Example:
// {
//     name: "upper body",
//     description: "",
//     muscles: {
//         biceps: 1,
//         chest: 0,
//     },
//     sets: [
//         {
//             reps: 1,
//             mass: 1,
//         },
//         {
//             reps: 6,
//             mass: 14,
//         }
//     ]
// }
export interface Exercise {
  id?: string;
  name: string;
  description: string;
  muscles: { [key: string]: number };
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  reps: number;
  mass: number;
}
