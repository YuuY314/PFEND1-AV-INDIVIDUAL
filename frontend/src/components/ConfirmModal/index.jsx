"use client";

import Modal from "@/components/Modal";

export default function ConfirmModal({ title, message, confirmLabel = "Confirmar", loading = false, error = "", onConfirm, onCancel }){
    return (
        <Modal title={title} onClose={onCancel}>
            <div className="modal-body">
                <p className="mb-0">{message}</p>
                {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
                    Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                    {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"/>}
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
