import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, initAuth } from "./firebase"; // Ensure firebase.js is in /src/
import StatsHeader from "./components/StatsHeader";
import TrailerForm from "./components/TrailerForm";
import TrailerList from "./components/TrailerList";
import trailerLogo from "./assets/icons8-trailer-96.png";
import prwsLogo from "./assets/My logo2.svg"; // Assuming this is your PRWS logo for the footer
// Import your custom design styles
import "./Styles.css";

// Using 'default-app-id' to match your original app's default behavior
const APP_ID = "default-app-id";

function App() {
  const [trailers, setTrailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastAction, setLastAction] = useState("");

  useEffect(() => {
    initAuth();
    const trailersRef = collection(
      db,
      `artifacts/${APP_ID}/public/data/trailers`,
    );

    // Filter logic: show only trailers updated within the last 10 hours
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);

    const unsubscribe = onSnapshot(
      query(trailersRef),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((t) => {
            if (!t.timestamp) return true;
            // Safety check for Firestore Timestamp vs JS Date
            const date = t.timestamp.toDate
              ? t.timestamp.toDate()
              : new Date(t.timestamp);
            return date > tenHoursAgo;
          });

        setTrailers(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Snapshot Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Pre-calculate occupied spots to prevent trailer overlaps in the fenceline
  const occupiedSpots = useMemo(() => {
    const spots = new Map();
    trailers.forEach((t) => {
      if (t.northFence && t.northFence !== "None") {
        spots.set(`NF:${t.northFence}`, { id: t.id, number: t.trailerNumber });
      }
      if (t.southFence && t.southFence !== "None") {
        spots.set(`SF:${t.southFence}`, { id: t.id, number: t.trailerNumber });
      }
    });
    return spots;
  }, [trailers]);

  const handleSave = async (trailerData) => {
    try {
      // Use trailer number as ID to maintain unique records per trailer
      const docId = editingTrailer?.id || trailerData.trailerNumber;

      const trailerRef = doc(
        db,
        `artifacts/${APP_ID}/public/data/trailers`,
        docId,
      );
      const logRef = doc(
        collection(db, `artifacts/${APP_ID}/public/data/trailer_logs`),
      );

      const dataToSave = {
        ...trailerData,
        timestamp: serverTimestamp(),
      };

      await setDoc(trailerRef, dataToSave);

      // Save log entry (as seen in original app.js)
      await setDoc(logRef, {
        ...dataToSave,
        action: editingTrailer ? "update" : "create",
        logTimestamp: serverTimestamp(),
      }).catch((err) => console.warn("Log failed", err));

      const parkingSpot =
        trailerData.northFence !== "None"
          ? ` (NF: ${trailerData.northFence})`
          : trailerData.southFence !== "None"
            ? ` (SF: ${trailerData.southFence})`
            : "";

      setLastAction(
        `${editingTrailer ? "Updated" : "Entered"}: ${trailerData.trailerNumber}${parkingSpot}`,
      );
      setEditingTrailer(null);

      // Hide notification after 3 seconds
      setTimeout(() => setLastAction(""), 3000);
    } catch (error) {
      console.error("Error saving trailer:", error);
      alert("Failed to save trailer.");
    }
  };

  const handleDelete = async (id, number) => {
    if (window.confirm(`Are you sure you want to delete trailer ${number}?`)) {
      try {
        await deleteDoc(
          doc(db, `artifacts/${APP_ID}/public/data/trailers`, id),
        );
        setLastAction(`Deleted: ${number}`);
        setTimeout(() => setLastAction(""), 3000);
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div className="app-container">
      {loading && (
        <div id="loading-overlay" style={{ display: "flex" }}>
          <div className="loader"></div>
        </div>
      )}

      <div className="app-wrapper">
        {" "}
        {/* This wraps all main content */}
        <div className="container">
          <h1 className="title">Yard Walk 2.0</h1>
          {/* Error message div, initially hidden */}
          <div id="error-message" style={{ display: "none" }}></div>

          <TrailerForm
            onSave={handleSave}
            editingTrailer={editingTrailer}
            onCancel={() => setEditingTrailer(null)}
            occupiedSpots={occupiedSpots}
            setSearchQuery={setSearchQuery}
          />

          <StatsHeader trailers={trailers} />

          {lastAction && (
            <div
              id="last-entered-window"
              className="last-entered-window"
              style={{ display: "block" }}
            >
              {lastAction}
            </div>
          )}
        </div>
        <div className="container">
          <h1 className="title">Entered Trailers</h1>
          <TrailerList
            trailers={trailers}
            searchQuery={searchQuery}
            onEdit={setEditingTrailer}
            onDelete={handleDelete}
            editingTrailer={editingTrailer} // Pass editingTrailer to disable edit/delete buttons when editing
          />
        </div>
      </div>

      <footer>
        <figure className="my__logo">
          <img src={prwsLogo} alt="PR Web Solutions Logo" />
        </figure>
        <p className="logo__text">
          PR Web Solutions &copy; {new Date().getFullYear()}
        </p>
        <div className="footer__text">
          Questions, Comments,
          <a
            href="mailto:prwscodingwsc@gmail.com"
            target="_blank"
            style={{ color: "white" }}
          >
            <u>Contact me</u>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
