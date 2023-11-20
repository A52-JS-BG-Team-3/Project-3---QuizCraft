import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (userName) => {

  return get(ref(db, `users/${userName}`));
};

export const createUserHandle = (userData) => {
  return set(ref(db, `users/${userData.userName}`), {
    ...userData,
    createdOn: new Date(),
  });
};


export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const fetchUserName = async (uid) => {
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      let foundUserName = "Unknown";
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.uid === uid) {
          foundUserName = childSnapshot.key;
          return true;
        }
      });
      return foundUserName;
    } else {
      console.error("No users found in database.");
      return "Unknown";
    }
  } catch (error) {
    console.error("Error fetching user names:", error);
    return "Unknown";
  }
};