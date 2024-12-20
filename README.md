# book-spotter

## 📖 Overview
Book Spotter is a mobile application built with React Native and Expo. It allows users to search for books, view details, mark books as favorites, and track books they have read. Users can also send book recommendations via email.

## ✨ Features
- **Search Books**: Search for books using the Google Books API.
- **Book Details**: View detailed information about a book, including title, authors, description, and more.
- **Favorites**: Mark books as favorites and view them in the Favorites screen.
- **Read Books**: Track books that you have read.
- **Email Recommendations**: Send book recommendations via email.
- **Dark Mode**: Toggle between light and dark themes.

## 🛠️ Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/maajoo/book-spotter.git
    cd book-spotter
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Google Books API key:
    ```properties
    EXPO_PUBLIC_API_KEY='your_google_books_api_key'
    ```

4. Start the application:
    ```sh
    npx expo start
    ```

## 📂 Project Structure
- `App.js`: Entry point of the application.
- `ThemeContext.js`: Context for managing light and dark themes.
- `TabNavigator.js`: Bottom tab navigator for navigating between Home, Favorites, and Profile screens.
- `firebaseConfig.js`: Firebase configuration and initialization.
- `components/`: Contains reusable components such as `fetchBooks.js`, `renderBooks.js`, `sendEmail.js`, `toggleFavourite.js`, and `toggleRead.js`.
- `screens/`: Contains screen components such as `BookDetailsScreen.js`, `FavouriteScreen.js`, `HomeScreen.js`, `LoginScreen.js`, `ProfileScreen.js`, `ReadScreen.js`, and `RegisterScreen.js`.
- `.expo/`: Contains Expo-specific files (ignored by Git).
- `assets/`: Contains images and other static assets.
- `babel.config.js`: Babel configuration.
- `package.json`: Project dependencies and scripts.
- `.gitignore`: Specifies files and directories to be ignored by Git.

## 📦 Dependencies
- React
- React Native
- Expo
- Firebase
- React Navigation
- Expo Mail Composer
- React Native Root Toast
- He (HTML entity encoder/decoder)