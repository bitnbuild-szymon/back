export interface UserProfile {
  id?: string;
  email?: string;
  username: string;
  ownedWorkouts?: string[]; // ids
  sharedWorkouts?: string[]; // ids
  friends: string[]; // ids
}
