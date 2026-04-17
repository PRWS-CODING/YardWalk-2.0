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
import { db, initAuth } from "./firebase";
import TrailerForm from "./components/TrailerForm";
import Trailers from "./components/Trailers";
// prwsLogo filename should be checked for exact casing in your filesystem
import prwsLogo from "./assets/My logo2.svg";

import "./Styles.css";
// TrailerInput is used inside TrailerForm, no need to import here

// Using 'default-app-id' to match your original app's default behavior
const APP_ID = "default-app-id";

function App() {
  const [trailers, setTrailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastAction, setLastAction] = useState("");
  const [initError, setInitError] = useState(false);

  useEffect(() => {
    console.log("App initializing...");

    if (!db) {
      console.warn("Database initialization failed. Check your API Key.");
      setInitError(true);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const startListening = async () => {
      await initAuth();

      const trailersRef = collection(
        db,
        `artifacts/${APP_ID}/public/data/trailers`,
      );

      unsubscribe = onSnapshot(
        query(trailersRef),
        (snapshot) => {
          console.log(`Firebase: Received ${snapshot.size} documents`);
          const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
          const now = Date.now();

          const data = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((t) => {
              if (!t.timestamp) return true; // Keep local optimistic updates
              const trailerTime = t.timestamp.toMillis
                ? t.timestamp.toMillis()
                : t.timestamp;
              return now - trailerTime < TEN_HOURS_MS;
            });

          setTrailers(data);
          setLoading(false);
        },
        (error) => {
          console.error("Firebase Snapshot Error:", error.code, error.message);
          setLoading(false);
        },
      );
    };

    startListening();

    const expirationCheck = setInterval(() => {
      const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
      const now = Date.now();
      setTrailers((prev) =>
        prev.filter((t) => {
          if (!t.timestamp) return true;
          const trailerTime = t.timestamp.toMillis
            ? t.timestamp.toMillis()
            : t.timestamp;
          return now - trailerTime < TEN_HOURS_MS;
        }),
      );
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(expirationCheck);
    };
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
          {initError && (
            <div
              className="error-banner"
              style={{
                backgroundColor: "#3f0909",
                color: "#fca5a5",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                border: "1px solid #ef4444",
                textAlign: "center",
              }}
            >
              <strong>Configuration Error:</strong> Firebase API Key is missing.
              Please add <code>VITE_API_KEY</code> to Vercel and{" "}
              <strong>Redeploy</strong>.
            </div>
          )}

          <TrailerForm
            onSave={handleSave}
            editingTrailer={editingTrailer}
            onCancel={() => setEditingTrailer(null)}
            occupiedSpots={occupiedSpots}
            setSearchQuery={setSearchQuery}
          />

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
          <Trailers
            trailers={trailers}
            searchQuery={searchQuery}
            onEdit={setEditingTrailer}
            onDelete={handleDelete}
            editingTrailer={editingTrailer}
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
