export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscles: Muscle[];
  sets: ExerciseSet[];
}

export interface Muscle {
  name: string;
  value: number;
}

export interface ExerciseSet {
  reps: number;
  mass: number;
}
