export async function searchBooks(searchQuery) {

  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}`);
  if (!response.ok) {
    throw new Error("Something went wrong: " + response.statusText);
  }
  return await response.json();
}