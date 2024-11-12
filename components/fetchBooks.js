export async function fetchBooks(searchQuery, bookId = null) {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  //in a case where the navigation happens from FavouriteScreen the books identifier is called bookId
  //if the navigation happens from searchResultScreen the identifier will be in the "searchQuery" that holds the keyword from TextInput field
  const url = bookId
    ? `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
    : `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong: " + response.statusText);
  }
  return await response.json();
}