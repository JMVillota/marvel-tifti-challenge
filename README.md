# Marvel Series Explorer

This project is a Marvel series explorer application built with Vue.js as part of the TIFTI technical challenge. It allows users to browse, search, and save their favorite Marvel series using the official Marvel API.

## 🚀 Features

- Browse Marvel series with infinite scroll
- Search functionality
- Detailed view for each series
- Save favorite series (up to 10)
- View history of explored series
- Responsive design
- Dark theme

## 🛠️ Built With

- Vue.js 3
- Vue Router
- Pinia for state management
- Crypto-js for Marvel API authentication

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Marvel API Keys (get them at [Marvel Developer Portal](https://developer.marvel.com/))

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/JMVillota/marvel-tifti-challenge.git
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Marvel API keys:
```env
VUE_APP_MARVEL_PUBLIC_KEY=your_public_key_here
VUE_APP_MARVEL_PRIVATE_KEY=your_private_key_here
```

4. Run the development server
```bash
npm run serve
```

## 🔧 Project Structure

```
marvel-series-explorer/
├── src/
│   ├── components/        # Reusable components
│   ├── views/            # Page components
│   ├── router/           # Vue router configuration
│   ├── stores/           # Pinia stores
│   ├── styles/           # Global styles
│   ├── layout/           # Layout components
│   └── App.vue          # Root component
```

## 🖥️ Usage

1. Access the application through your browser at `http://localhost:8080`
2. Browse through Marvel series
3. Click on any series to view details
4. Use the search bar to find specific series
5. Save your favorite series (maximum 10)
6. Access your viewing history in the History section

## 🚀 Deployment

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## 📝 Notes

- The application uses the official Marvel API
- Series data is cached in localStorage
- Maximum of 10 saved series allowed
- Responsive design for all devices

## ⚖️ License

This project includes Marvel data provided by Marvel. © 2024 MARVEL

## 👨‍💻 Author

**Jefferson Villota**
- GitHub: [https://github.com/jefferson1104](https://github.com/jefferson1104)
- LinkedIn: [https://www.linkedin.com/in/jefferson-villota-murillo-41822ba2](https://www.linkedin.com/in/jefferson-villota-murillo-41822ba2)

## 🌟 Acknowledgments

- Marvel for providing the API
- TIFTI for the challenge opportunity