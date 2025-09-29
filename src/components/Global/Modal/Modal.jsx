import React, { useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const Modal = ({ isOpen, onClose, title, children, width }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, type: "spring" }}
            style={{
              background: "#fff",
              borderRadius: "6px",
              maxWidth: width || "400px",
              width: "100%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              maxHeight: "90vh", // 👈 مهم
              overflowY: "auto", // 👈 مهم
            }}
          >
            {title && (
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #dee2e6",
                  textAlign: "center",
                }}
              >
                <h5 style={{ margin: 0 }}>{title}</h5>
              </div>
            )}
            <div style={{ padding: "1rem" }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
