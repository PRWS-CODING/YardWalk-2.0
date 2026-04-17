# YardWalk 2.0

A digital trailer tracking solution designed to replace traditional paper-and-pen methods. Built specifically for yard crews to streamline operations, reduce errors, and provide real-time visibility into trailer statuses.

## 🚀 Features

- **Real-time Tracking:** Powered by Firebase for instant updates across the yard.
- **Smart Categorization:** Automatically groups trailers by status:
  - Needs Fuel
  - Salvage
  - Empty
  - Pallet Shuttle
  - Inbound & Seasonal
- **Advanced Sorting:** Intelligently sorts trailers based on their physical location (North/South Fence lines).
- **Mobile Optimized:** Designed with a mobile-first approach for easy use on Apple and Android devices while walking the yard.
- **Search & Filter:** Quickly locate specific trailers with a responsive search bar.
- **Visual Cues:** High-visibility color coding (e.g., green for fueled, red for needs fuel) for quick scanning.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Anonymous Auth
- **Styling:** Custom CSS with interactive "Holo" components

## 🛠️ Setup & Installation

1. **Clone the repo**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your `VITE_API_KEY`.
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
