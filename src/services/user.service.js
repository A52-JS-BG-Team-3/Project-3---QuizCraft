import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ref as storageRef, getDownloadURL , getStorage} from 'firebase/storage';

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

const fetchUser = async (userName) => {
  try {
    const userRef = ref(db, `users/${userName}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      // const userData = userSnapshot.val();

      const avatarRef = storageRef(getStorage(), `profileAvatars/${userName}`);
      const avatarUrl = await getDownloadURL(avatarRef);

      return {
        userName,
        avatar: avatarUrl,
      };
    } else {
      console.error(`User with username ${userName} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

export default fetchUser;