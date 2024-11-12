import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const toggleFavorite = async (db, user, id, title) => {
  if (!user) return;

  const uid = user.uid;
  const docRef = doc(db, "favourites", `${uid}_${id}`);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      await deleteDoc(docRef);
      return false; // Indicates item was removed from favorites
    } else {
      await setDoc(docRef, { uid, bookId: id, bookTitle: title, timestamp: Date.now() });
      return true; // Indicates item was added to favorites
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};