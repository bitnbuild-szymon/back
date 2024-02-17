export interface UserProfile {
  id?: string;
  email?: string;
  username: string;
  ownedWorkouts?: string[]; // ids
  sharedWorkouts?: SharedWorkout[];
  friends: string[]; // ids
}

export interface SharedWorkout {
  id: string;
  by: string;
}
