# Clinique Frontend

React frontend for medical clinic management system.

## Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components (Patient, Appointment, etc)
├── context/        # Auth & App context
├── Services/       # API service calls
├── styles/         # Global styles
├── App.jsx         # Main component
└── main.jsx        # Entry point
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Bootstrap** - Components

## Environment Variables

Create `.env`:

```bash
VITE_API_URL=http://localhost:8000
```

## Code Quality

```bash
npm run lint      # Check code
npm run format    # Format code
```

Pre-commit hooks will run automatically before each commit.

## API Integration

All API calls go through `src/Services/api.js`:

```javascript
import patientService from '../Services/patientService';

const patients = await patientService.getAll();
```

Endpoints are configured for JWT authentication.

## Dependencies

- React 19.1.0
- Vite 6.3.5
- React Router 7.6.0
- Axios 1.9.0
- Tailwind CSS 3.4.3
- Bootstrap 5.3.6
- Lucide React (icons)

## Build for Production

```bash
npm run build
```

Output in `dist/` folder ready for deployment.
