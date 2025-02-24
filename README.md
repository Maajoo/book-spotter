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
    git clone https://github.com/Maajoo/book-spotter.git
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

## 📸 Screenshots

<table>
  <tr>
    <td>
      <h4>Login Screen</h4>
      <img src="./screenshots/screenshot1.PNG" alt="Login Screen" width="200"/>
    </td>
    <td>
      <h4>Home Screen</h4>
      <img src="./screenshots/screenshot2.PNG" alt="Home Screen" width="200"/>
    </td>
    <td>
      <h4>Search Results</h4>
      <img src="./screenshots/screenshot3.PNG" alt="Search Results" width="200"/>
    </td>
    <td>
      <h4>Book Details</h4>
      <img src="./screenshots/screenshot4.PNG" alt="Book Details" width="200"/>
    </td>
  </tr>
  <tr>
    <td>
      <h4>Book Details scrolled</h4>
      <img src="./screenshots/screenshot5.PNG" alt="Book Details scrolled" width="200"/>
    </td>
    <td>
      <h4>Favorites</h4>
      <img src="./screenshots/screenshot6.PNG" alt="Favorites" width="200"/>
    </td>
    <td>
      <h4>Profile</h4>
      <img src="./screenshots/screenshot7.PNG" alt="Profile" width="200"/>
    </td>
    <td>
      <h4>Finished Books</h4>
      <img src="./screenshots/screenshot8.PNG" alt="Finished Books" width="200"/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <h4>Login Screen (dark)</h4>
      <img src="./screenshots/screenshot1d.PNG" alt="Login Screen" width="200"/>
    </td>
    <td>
      <h4>Home Screen (dark)</h4>
      <img src="./screenshots/screenshot2d.PNG" alt="Home Screen" width="200"/>
    </td>
    <td>
      <h4>Search Results (dark)</h4>
      <img src="./screenshots/screenshot3d.PNG" alt="Search Results" width="200"/>
    </td>
    <td>
      <h4>Book Details (dark)</h4>
      <img src="./screenshots/screenshot4d.PNG" alt="Book Details" width="200"/>
    </td>
  </tr>
  <tr>
    <td>
      <h4>Book Details scrolled (dark)</h4>
      <img src="./screenshots/screenshot5d.PNG" alt="Book Details scrolled" width="200"/>
    </td>
    <td>
      <h4>Favorites (dark)</h4>
      <img src="./screenshots/screenshot6d.PNG" alt="Favorites" width="200"/>
    </td>
    <td>
      <h4>Profile (dark)</h4>
      <img src="./screenshots/screenshot7d.PNG" alt="Profile" width="200"/>
    </td>
    <td>
      <h4>Finished Books (dark)</h4>
      <img src="./screenshots/screenshot8d.PNG" alt="Finished Books" width="200"/>
    </td>
  </tr>
</table>

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