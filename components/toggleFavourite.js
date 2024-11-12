import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const toggleFavorite = async (db, user, id, title) => {
  if (!user) return;

  const uid = user.uid;
  const docRef = doc(db, "favourites", `${uid}_${id}`);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      await deleteDoc(docRef);
      return false;
    } else {
      await setDoc(docRef, { uid, bookId: id, bookTitle: title, timestamp: Date.now() });
      return true;
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
    throw error;
  }
};