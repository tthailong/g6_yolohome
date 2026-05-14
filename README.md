# Smart Home Dashboard

A modern, responsive smart home dashboard built with Next.js and Tailwind CSS.

## Features

- **Responsive Design**: Adapts to different screen sizes (desktop, tablet, mobile).
- **Dark Mode**: Built-in dark theme with custom color palette.
- **Sidebar Navigation**: Collapsible sidebar with icons.
- **Device Management**: Add, view, and control smart devices.
- **Device Detail Pages**: Dedicated pages for different device types (Lamp, Door).
- **Custom Components**: Reusable UI components for a premium look and feel.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **IoT Integration**: [Adafruit IO](https://io.adafruit.com/)
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/))
- [Python 3.10+](https://www.python.org/)
### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd g6_yolohome
   ```

2. Setup Frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Setup Database (only first time):
   ```bash
   # Full setup with sample data (Recommended)
   mysql -u root -p < backend/g6yolohome.sql
   ```

   *Note: The script creates an admin (`adminapp`) and a user (`hailong`), both with the password `password`.*

4. Setup Backend (from project root):
   ```bash
   # Create virtual environment in root
   python -m venv venv

   # Activate (Windows)
   .\venv\Scripts\Activate

   # Install dependencies
   pip install -r backend/requirement.txt
   ```

### Environment Configuration

Create a `.env` file in the `backend/` directory with the following content:

```env
# Auth Configuration
AUTH_SECRET_KEY=your_secret_key_here
AUTH_ALGORITHM=HS256

# Database Configuration
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/g6yolohome

# Adafruit IO Credentials
ADAFRUIT_IO_USERNAME=YOUR_ADAFRUIT_IO_USERNAME
ADAFRUIT_IO_KEY=YOUR_ADAFRUIT_IO_KEY
```

### Development

**1. Run Frontend**:
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

**2. Run Backend**:

```bash
# Go to the api directory
cd backend/api

# Start the server (ensure venv is active)
uvicorn main:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the API documentation.

## Project Structure

```
g6_yolohome/
├── backend/             # FastAPI Backend
│   ├── api/             # API Core logic
│   │   ├── routers/     # API Route Handlers
│   │   ├── main.py      # Server entry point
│   │   ├── models.py    # Database models
│   │   ├── schemas.py   # Pydantic models
│   │   ├── database.py  # Connection setup
│   │   ├── mqtt_manager.py  # MQTT Manager
│   │   ├── deps.py      # Dependencies
│   │   ├── socket_manager.py # Socket Manager
│   │   └── .env             # Environment variables
│   ├── requirement.txt  # Dependencies
│   └── g6yolohome.sql   # Database Initialization
├── frontend/            # Next.js Frontend
│   ├── app/             # App Router pages
│   │   ├── contexts/    # Context pages
│   │   ├── devices/     # Device pages
│   │   │   ├── page.tsx # Device list
│   │   │   ├── lamp/    # Lamp page
│   │   │   └── door/    # Door page
│   │   └── ...         # More pages
│   ├── components/      # UI components
│   ├── context/         # React Context (State)
│   └── lib/             # API Clients & Helpers
├── venv/                # Python Virtual Env
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
