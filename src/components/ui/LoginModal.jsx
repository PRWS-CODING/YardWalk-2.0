import React, { useState } from "react";
import { YARDS } from "../../Yard";


function LoginModal({ onLoginSuccess, onClose, canClose }) {
  const [selectedYardId, setSelectedYardId] = useState(YARDS[0].id);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenYard = YARDS.find((y) => y.id === selectedYardId);

    if (!chosenYard) {
      setError("Please select a yard location.");
      return;
    }

    if (passcode.trim() !== chosenYard.passcode) {
      setError("Incorrect yard passcode.");
      return;
    }

    setError("");
    setPasscode("");
    onLoginSuccess(chosenYard);
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-card">
        <h2 className="login-modal-title">Yard Walk Sign-In</h2>

        <form onSubmit={handleSubmit} className="login-modal-form">
          <label className="login-label" htmlFor="yard-select">
            Where are you at?
          </label>
          <select
            id="yard-select"
            className="login-input"
            value={selectedYardId}
            onChange={(e) => {
              setSelectedYardId(e.target.value);
              setError("");
            }}
          >
            {YARDS.map((yard) => (
              <option key={yard.id} value={yard.id}>
                {yard.name}
              </option>
            ))}
          </select>

          <label className="login-label" htmlFor="yard-passcode">
            Yard Passcode
          </label>
          <input
            id="yard-passcode"
            type="password"
            inputMode="numeric"
            className="login-input"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError("");
            }}
            autoFocus
          />

          {error && <p className="login-error">{error}</p>}

          <div className="login-modal-actions">
            <button type="submit" className="login-submit-btn">
              Enter Yard
            </button>
            {canClose && (
              <button
                type="button"
                className="login-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
