import React from "react";

const DeleteZoneModal = ({ isOpen, onClose, onConfirm, zoneName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 animate-scaleIn">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-red-600">
          Delete Zone
        </h2>

        {/* Message */}
        <p className="mt-3 text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black">
            {zoneName}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteZoneModal;