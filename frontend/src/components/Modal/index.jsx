"use client";

import { useEffect } from "react";

export default function Modal({ title, onClose, size = "", children }){
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") onClose();
        }

        const previousOverflow = document.body.style.overflow;

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    function handleBackdropMouseDown(event) {
        if (event.target === event.currentTarget) onClose();
    }

    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-label={title} onMouseDown={handleBackdropMouseDown}>
                <div className={`modal-dialog modal-dialog-centered ${size}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose}/>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"/>
        </>
    );
}
