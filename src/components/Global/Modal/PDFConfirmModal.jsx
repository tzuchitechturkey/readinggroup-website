import React from "react";

import { formatDateToBackend } from "@/Utility/statitics/emergency/formatDateToBackend";
import Modal from "@/components/Global/Modal/Modal";

const PDFConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  t,
  startDate,
  endDate,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={t("Confirm PDF Download")}>
    <p>
      {t("The downloaded file will contain only records with status")}{" "}
      <b>{t("Delivered")}</b>.<br />
      <span>
        <b>{t("Start Date")}:</b> {formatDateToBackend(startDate)}
        <br />
        <b>{t("End Date")}:</b> {formatDateToBackend(endDate)}
      </span>
    </p>
    <p>{t("Are you sure you want to download the PDF file?")}</p>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
      <button className="btn btn-secondary" onClick={onClose}>
        {t("Cancel")}
      </button>
      <button className="btn btn-primary" onClick={onConfirm}>
        {t("Download")}
      </button>
    </div>
  </Modal>
);

export default PDFConfirmModal;
