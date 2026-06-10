# G6 YoloHome: Smart Home Management Ecosystem

G6 YoloHome is a real-time IoT smart home system that connects a web dashboard with Yolobit microcontrollers. Sensor data and control commands are exchanged through the Adafruit IO MQTT broker and WebSockets, allowing users to monitor and control devices remotely using the web application and Ohstem App.

---

## Key Features

*   **Sanctuary Access (RBAC)**: Manages permissions across multiple homes.
    *   Assigns roles: Owner, Manager, and Member.
    *   Handles invitation flows (invite, accept/reject, delete members).
*   **Dashboard Monitoring**: Reads temperature, humidity, and earthquake data from Adafruit IO. Reads face detection data from database.
    *   Updates the dashboard instantly using WebSockets.
*   **Appliance Control**: Control fans, lights, and door states from the web, IR remote, or voice commands.
*   **Smart Door**: Detects faces using a webcam feed.
    *   Unlocks the door automatically for recognized family members.
    *   Saves captured photos to Cloudinary and the database.
    *   Uses a 2s confirmation threshold and 5-minute cooldown per person to avoid duplicate logs.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **IoT Integration**: [Adafruit IO](https://io.adafruit.com/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (for storing camera log images)
- **Real-time Channel**: [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/Websockets_API) (for dashboard telemetry and camera log updates)
- **AI Recognition**: [Teachable Machine](https://teachablemachine.withgoogle.com/) / [TensorFlow.js](https://js.tensorflow.org/) (for client-side face recognition)

---

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v22.19.0 or higher recommended)
*   [Python 3.10+](https://www.python.org/)
*   [MySQL Server](https://www.mysql.com/)

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
   # Firstly, change mock data of 'YOUR_ADAFRUIT_IO_KEY', 'YOUR_ADAFRUIT_IO_USERNAME' in g6yolohome.sql file with your real data in .env file
   # Secondly, run this code
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
   pip install -r backend/requirements.txt
   ```

### Environment Configuration

Create a `.env` file in the `backend/api/` directory with the following content:

```env
# Auth Configuration
AUTH_SECRET_KEY=your_secret_key_here
AUTH_ALGORITHM=HS256

# Database Configuration
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/g6yolohome

# Adafruit IO Credentials
ADAFRUIT_IO_USERNAME=YOUR_ADAFRUIT_IO_USERNAME
ADAFRUIT_IO_KEY=YOUR_ADAFRUIT_IO_KEY

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

# SMTP Credentials
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
```

Create a `.env` file in the `frontend/` directory with the following content:

```env
# Teachable Machine Credentials
NEXT_PUBLIC_TEACHABLE_MACHINE_URL=YOUR_URL
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
├── backend/                   # FastAPI Backend
│   ├── api/                   # API Core logic
│   │   ├── routers/           # API Route Handlers
│   │   ├── adafruit_utils.py  # Adafruit IO utils
│   │   ├── database.py        # Connection setup
│   │   ├── deps.py            # Dependencies
│   │   ├── email_utils.py     # Email utils
│   │   ├── main.py            # Server entry point
│   │   ├── models.py          # Database models
│   │   ├── mqtt_manager.py    # MQTT Manager
│   │   ├── schemas.py         # Pydantic models
│   │   ├── socket_manager.py  # Socket Manager
│   │   └── .env               # Environment variables
│   ├── g6yolohome.sql         # Database Initialization
│   └── requirements.txt       # Dependencies
├── frontend/                  # Next.js Frontend
│   ├── app/                   # App Router pages
│   │   ├── contexts/          # Context pages
│   │   ├── devices/           # Device pages
│   │   │   ├── page.tsx       # Device list
│   │   │   ├── lamp/          # Lamp page
│   │   │   └── door/          # Door page
│   │   ├── ...                # More pages
│   │   └── .env               # Environment variables
│   ├── components/            # UI components
│   ├── context/               # React Context (State)
│   └── lib/                   # API Clients & Helpers
├── venv/                      # Python Virtual Env
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
