# Vue Calendar with FullCalendar

A modern event calendar application built with Vue.js 3 and FullCalendar library, featuring drag & drop functionality, multiple view modes, and comprehensive event management.

## Features

### ✅ Core Functionality
- **Event Creation**: Click on any date to create a new event
- **Event Editing**: Click on existing events to edit them
- **Event Deletion**: Delete events with confirmation
- **Drag & Drop**: Move events between dates and times
- **Multiple Views**: Month, Week, and Day view modes
- **Local Storage**: All data persists in browser storage

### ✅ Event Management
- **Event Name**: Required field (max 30 characters)
- **Event Date**: Date picker with calendar icon
- **Event Time**: Time picker with clock icon
- **Notes**: Required field (max 3000 characters)
- **Color Selection**: 8 predefined colors + custom color picker
- **Validation**: Prevents past dates/times and ensures required fields

### ✅ User Experience
- **Modern UI**: Clean, responsive design
- **Smooth Animations**: Modal transitions and hover effects
- **Error Handling**: Clear validation messages
- **Responsive Design**: Works on desktop and tablet
- **Keyboard Navigation**: Full accessibility support

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VueCalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Dependencies

### Core Dependencies
- **Vue.js 3**: Progressive JavaScript framework
- **FullCalendar**: Feature-rich calendar library
  - `@fullcalendar/vue3`: Vue 3 integration
  - `@fullcalendar/core`: Core functionality
  - `@fullcalendar/daygrid`: Month view
  - `@fullcalendar/timegrid`: Week/Day views
  - `@fullcalendar/interaction`: Drag & drop
  - `@fullcalendar/list`: List view (available)

### Development Dependencies
- **Vite**: Fast build tool
- **Pinia**: State management
- **Vue Router**: Client-side routing

## Project Structure

```
src/
├── components/
│   ├── CalendarApp.vue      # Main calendar component
│   └── EventModal.vue       # Event creation/editing modal
├── App.vue                  # Root component
├── main.js                  # Application entry point
├── style.css               # Global styles
└── utils/
    └── sortEvents.js       # Event sorting utilities
```

## Usage

### Creating Events
1. Click on any date in the calendar
2. Fill in the event details:
   - **Event Name** (required, max 30 chars)
   - **Event Date** (required, no past dates)
   - **Event Time** (required, no past times for today)
   - **Notes** (required, max 3000 chars)
   - **Color** (required, choose from palette or custom)
3. Click "Create Event" to save

### Editing Events
1. Click on any existing event
2. Modify the event details
3. Click "Save Changes" to update
4. Click "Delete" to remove the event

### Drag & Drop
- **Move between dates**: Drag events to different dates
- **Change time**: Drag events to different times (in week/day view)
- **Resize duration**: Drag event edges to change duration

### View Modes
- **Month View**: Overview of entire month
- **Week View**: Detailed weekly schedule with time slots
- **Day View**: Hour-by-hour daily view

## Data Storage

All events are stored in the browser's LocalStorage with the following structure:

```javascript
{
  id: String,           // Unique identifier
  title: String,        // Event name
  start: Date,          // Start date/time
  end: Date,           // End date/time (optional)
  notes: String,       // Event notes
  backgroundColor: String, // Event color
  borderColor: String,    // Border color
  textColor: String,      // Text color
  createdAt: Date,     // Creation timestamp
  updatedAt: Date      // Last update timestamp
}
```

## Customization

### Colors
The application includes 8 predefined colors:
- Blue (#3B82F6) - Default
- Red (#EF4444)
- Green (#10B981)
- Yellow (#F59E0B)
- Purple (#8B5CF6)
- Orange (#F97316)
- Cyan (#06B6D4)
- Pink (#EC4899)

### Styling
Global styles are in `src/style.css`. FullCalendar-specific styles use `!important` to override default themes.

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Development

### Adding New Features
1. Create new components in `src/components/`
2. Update `CalendarApp.vue` to include new functionality
3. Add any new dependencies to `package.json`
4. Update styles in `src/style.css`

### Code Style
- Use Vue 3 Composition API
- Follow Vue.js style guide
- Use semantic HTML
- Ensure accessibility compliance

## Troubleshooting

### Common Issues

1. **Events not saving**
   - Check browser console for errors
   - Verify LocalStorage is enabled
   - Clear browser cache if needed

2. **Drag & drop not working**
   - Ensure you're using a supported browser
   - Check that interaction plugin is loaded
   - Verify event has proper ID

3. **Modal not opening**
   - Check Vue devtools for component state
   - Verify event handlers are properly bound
   - Check for JavaScript errors

### Performance
- Large numbers of events may impact performance
- Consider implementing virtual scrolling for 1000+ events
- Use event filtering for better UX

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review FullCalendar documentation
3. Open an issue on GitHub
