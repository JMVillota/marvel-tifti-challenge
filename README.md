# Marvel Series Explorer

This project is a Marvel series explorer application built with Vue.js as part of the TIFTI technical challenge. It allows users to browse, search, and save their favorite Marvel series using the official Marvel API.

🌐 **[View Live Demo](https://challenge-tifty.netlify.app/)**

## ✨ Features

- Immersive splash screen animation
- Infinite scroll for seamless browsing
- Advanced search and filtering system
- Interactive series detail views
- Save favorites with visual management (up to 10)
- Viewing history with carousel navigation
- Responsive design for all devices
- Modern UI with smooth animations
- Lazy loading for optimal performance

## 🛠️ Technical Stack

- **Vue.js 3** - Latest composition API
- **Vue Router** - For seamless navigation
- **Pinia** - State management
- **Crypto-js** - Marvel API authentication
- **Intersection Observer** - Lazy loading & infinite scroll
- **Custom Animations** - Enhanced user experience

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Marvel API Keys from [Marvel Developer Portal](https://developer.marvel.com/)

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
│   ├── components/        # Reusable UI components
│   │   ├── ToastNotification.vue
│   │   └── SeriesCard.vue
│   ├── views/            # Page components
│   │   ├── HomeView.vue
│   │   ├── DetailView.vue
│   │   ├── HistoryView.vue
│   │   └── SplashScreen.vue
│   ├── router/           # Vue router configuration
│   ├── stores/           # Pinia state management
│   │   └── marvelStore.js
│   ├── styles/           # Global styles and themes
│   ├── layout/           # Layout components
│   └── App.vue          # Root component
```

## 🎯 Key Features Detailed

### Home View
- Infinite scroll implementation
- Advanced filtering system
- Responsive grid layout
- Real-time search functionality

### Detail View
- Interactive image gallery
- Comprehensive series information
- Related content management
- Save/unsave functionality

### History View
- Carousel navigation
- Separate saved and viewed sections
- Quick actions for series management
- Responsive design adaptations

## 🖥️ Usage

1. Access the application through the [Live Demo](https://challenge-tifty.netlify.app/) or locally at `http://localhost:8080`
2. Browse through the Marvel series catalog
3. Use search and filters to find specific series
4. Click on any series for detailed information
5. Save up to 10 favorite series
6. View your browsing history and saved collections
7. Use keyboard navigation in carousels

## 🚀 Deployment

Build for production:
```bash
npm run build
```
The built files will be in the `dist` directory.

## ⚡ Performance Optimizations

- Lazy loading for images
- Infinite scroll with intersection observer
- Debounced search functionality
- Optimized animations
- Local storage caching
- Responsive image loading

## 📱 Mobile Responsiveness

- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes
- Mobile-first approach

## 📝 Notes

- The application uses the official Marvel API
- Data is cached in localStorage for better performance
- Maximum of 10 saved series per user
- Fully responsive design for all devices
- Built with accessibility in mind

## ⚖️ License

This project includes Marvel data provided by Marvel. © 2024 MARVEL

## 👨‍💻 Author

**Jefferson Villota**
- GitHub: [JMVillota](http://github.com/JMVillota)
- Portfolio: [jeffersonvillota.netlify.app](https://jeffersonvillota.netlify.app/)

## 🌟 Acknowledgments

- Marvel for providing the comprehensive API
- TIFTI for the challenge opportunity
- Vue.js community for excellent documentation

## 📫 Contact

For any inquiries or suggestions, feel free to reach out through my portfolio or GitHub profile.