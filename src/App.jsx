import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  doc,
  where,
  orderBy,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, initAuth } from "./firebase";
import TrailerForm from "./components/TrailerForm";
import LoginModal from "./components/ui/LoginModal";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import Warning from "./components/ui/Warning";
import Trailers from "./components/Trailers";
import prwsLogo from "./assets/My logo2.svg";
import "./Styles.css";
import "./index.css";

function App() {
  const [trailers, setTrailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(!!db);
  const [lastAction, setLastAction] = useState("");
  const [initError] = useState(!db);

  // Yard login state: starts open on every refresh
  const [activeYard, setActiveYard] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  const currentAppId = activeYard ? activeYard.id : "default-app-id";

  const handleLoginSuccess = (yard) => {
    setActiveYard(yard);
    setEditingTrailer(null);
    setIsLoginOpen(false);
  };

  // Enforce Portrait Orientation Lock on runtime (works in standalone/supported mobile contexts)
  useEffect(() => {
    const lockPortraitOrientation = async () => {
      if (window.screen?.orientation?.lock) {
        try {
          await window.screen.orientation.lock("portrait");
          console.log("Screen orientation locked to portrait.");
        } catch (err) {
          console.warn(
            "Screen orientation lock deferred or unsupported in this tab:",
            err.message,
          );
        }
      }
    };

    lockPortraitOrientation();
  }, []);

  useEffect(() => {
    if (!db) {
      return;
    }

    setLoading(true);
    console.log(`App initializing for yard: ${currentAppId}...`);

    let unsubscribe = () => {};

    const startListening = async () => {
      await initAuth();
      const TEN_HOURS_MS = 20 * 60 * 60 * 1000;
      const cutoffTime = new Date(Date.now() - TEN_HOURS_MS);
      const trailersRef = collection(
        db,
        `artifacts/${currentAppId}/public/data/trailers`,
      );

      const q = query(
        trailersRef,
        where("timestamp", ">=", cutoffTime),
        orderBy("timestamp", "desc"),
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`Firebase: Received ${snapshot.size} live documents`);
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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

    return () => {
      console.log("App cleaning up...");
      unsubscribe();
    };
  }, [currentAppId]);

  // Pre-calculate occupied spots to prevent trailer overlaps in the fenceLine
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
      const docId = editingTrailer?.id || trailerData.trailerNumber;

      const trailerRef = doc(
        db,
        `artifacts/${currentAppId}/public/data/trailers`,
        docId,
      );
      const logRef = doc(
        collection(db, `artifacts/${currentAppId}/public/data/trailer_logs`),
      );

      const dataToSave = {
        ...trailerData,
        timestamp: serverTimestamp(),
      };

      await setDoc(trailerRef, dataToSave);

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

      setTimeout(() => setLastAction(""), 3000);
    } catch (error) {
      console.error("Error saving trailer:", error);
      setWarning("Failed to save trailer.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { id, number } = deleteId;
    try {
      await deleteDoc(
        doc(db, `artifacts/${currentAppId}/public/data/trailers`, id),
      );
      setLastAction(`Deleted: ${number}`);
      setDeleteId(null);
      setTimeout(() => setLastAction(""), 3000);
    } catch (error) {
      console.error("Error deleting:", error);
      setWarning("Failed to delete trailer.");
    }
  };

  return (
    <div className="app-container">
      {isLoginOpen && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginOpen(false)}
          canClose={!!activeYard}
        />
      )}

      {loading && (
        <div id="loading-overlay" style={{ display: "flex" }}>
          <div className="loader"></div>
        </div>
      )}

      <div className="app-wrapper">
        <div className="container">
          <h1
            className="title"
            onClick={() => setIsLoginOpen(true)}
            style={{ cursor: "pointer" }}
            title="Tap to switch yard"
          >
            Yard Walk 2.1.0
            {activeYard && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  opacity: 0.85,
                  marginTop: "4px",
                }}
              >
                {activeYard.name} (Tap to switch)
              </span>
            )}
          </h1>

          {initError && (
            <div className="warning-banner">
              <strong>Configuration Error:</strong> Firebase API Key is missing.
              Please add <code>VITE_API_KEY</code> to Vercel and{" "}
              <strong>Redeploy</strong>.
            </div>
          )}

          <Warning message={warning} onClear={() => setWarning("")} />

          {deleteId && (
            <ConfirmationModal
              message={`Are you sure you want to delete trailer ${deleteId.number}?`}
              onConfirm={handleDelete}
              onCancel={() => setDeleteId(null)}
            />
          )}

          <TrailerForm
            onSave={handleSave}
            editingTrailer={editingTrailer}
            onCancel={() => setEditingTrailer(null)}
            occupiedSpots={occupiedSpots}
            setSearchQuery={setSearchQuery}
            onWarning={setWarning}
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
            onDelete={(id, number) => setDeleteId({ id, number })}
            editingTrailer={editingTrailer}
          />
        </div>
      </div>

      <footer>
        <figure className="my__logo">
          <img src={prwsLogo} alt="PR Web Solutions Logo" />
        </figure>
        <p className="logo__text">PR Web Solutions &copy; 2025</p>
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
