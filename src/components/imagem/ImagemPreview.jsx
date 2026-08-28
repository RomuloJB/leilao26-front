import React from "react";
import Api from "../../api/axiosInstance";

export function imagemUrl(imagemId) {
    return `${Api.defaults.baseURL}/imagem/${imagemId}/arquivo`;
}

export default function ImagemPreview({ src, alt, nova, onRemover }) {
    return (
        <div className={`imagem-item${nova ? " imagem-item-nova" : ""}`}>
            <img src={src} alt={alt} />
            <button
                type="button"
                className="imagem-item-remover"
                onClick={onRemover}
                aria-label="Remover imagem"
            >
                ×
            </button>
        </div>
    );
}