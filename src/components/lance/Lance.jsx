import React, { useState } from "react";
import LanceModal from "./LanceModal";
import "./Lance.css";

/**
 * Botão "Dar lance" + popup.
 *
 * Uso: <Lance leilao={leilao} onLanceRegistrado={(lance) => ...} />
 * Quem decide se o botão deve aparecer é o pai (via podeDarLance do AuthContext).
 * onLanceRegistrado recebe o LanceResponseDTO criado pra o pai atualizar o estado dele.
 */
export default function Lance({ leilao, onLanceRegistrado, className = "" }) {
    const [aberto, setAberto] = useState(false);

    const handleSucesso = (lance) => {
        setAberto(false);
        onLanceRegistrado?.(lance);
    };

    return (
        <>
            <button
                type="button"
                className={`botao-lance ${className}`.trim()}
                onClick={() => setAberto(true)}
            >
                Dar lance
            </button>

            {aberto && (
                <LanceModal
                    leilao={leilao}
                    onFechar={() => setAberto(false)}
                    onSucesso={handleSucesso}
                />
            )}
        </>
    );
}
