import React, { useState, useEffect } from "react";


export default function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content position-relative p-4">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            aria-label="Fermer"
            onClick={onClose}
          ></button>
          {children}
        </div>
      </div>
    </div>
  );
}