# Vue Calendar App

A modern, interactive calendar application built with Vue 3 and FullCalendar. Features event creation, editing, drag & drop, and multiple view modes.

## Features

- 📅 **Multiple Views**: Month, Week, and Day views
- ✨ **Event Management**: Create, edit, and delete events
- 🎨 **Color Coding**: Customize event colors
- 📝 **Rich Notes**: Add detailed notes to events
- 🖱️ **Drag & Drop**: Move events between dates and times
- 💾 **Local Storage**: Events persist between sessions
- 📱 **Responsive Design**: Works on desktop devices
- 🎯 **Popover Interface**: Modern popover-style event forms

## Live Demo

Visit the live application: [Vue Calendar App](https://prykhodko-pasha.github.io/VueCalendar/)

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **FullCalendar** - Full-featured calendar library
- **Vite** - Fast build tool and dev server
- **LocalStorage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/prykhodko-pasha/VueCalendar.git
cd VueCalendar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating Events
- **Month View**: Click on any date cell
- **Week/Day View**: Click and drag on time slots
- Fill in the event details and click "Save"

### Editing Events
- Click on any existing event
- Modify the details and click "Edit"

### Deleting Events
- Click on an event to open the edit form
- Click "Discard" to delete the event

### Navigation
- Use "Today", "Back", and "Next" buttons to navigate
- Switch between Month, Week, and Day views using the view switcher

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The built files are in the `dist` directory

3. Deploy the contents of `dist` to your web server

### GitHub Pages Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

1. Ensure your repository is named `VueCalendar`
2. Push your code to the main branch
3. Go to your repository Settings > Pages
4. Set the source to "GitHub Actions"
5. The workflow will automatically build and deploy your app

## Project Structure

```
VueCalendar/
├── src/
│   ├── components/
│   │   ├── CalendarApp.vue      # Main calendar component
│   │   └── EventModal.vue       # Event creation/edit popover
│   ├── assets/                  # Static assets
│   ├── utils/                   # Utility functions
│   ├── App.vue                  # Root component
│   ├── main.js                  # Application entry point
│   └── style.css                # Global styles
├── public/                      # Public assets
├── .github/workflows/           # GitHub Actions workflows
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [FullCalendar](https://fullcalendar.io/) for the excellent calendar library
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Vite](https://vitejs.dev/) for the fast build tool
