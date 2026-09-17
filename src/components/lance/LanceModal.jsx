import React, { useEffect, useRef, useState } from "react";
import lanceService from "../../services/lanceService";
import { formatarValor } from "../../utils/format";
import "./Lance.css";

export function calcularValorMinimoPermitido(leilao) {
    const lanceMinimo = Number(leilao.lanceMinimo) || 0;
    if (leilao.maiorLance == null) return lanceMinimo;
    const incremento = Number(leilao.valorIncremento) || 0;
    return Math.max(lanceMinimo, Number(leilao.maiorLance) + incremento);
}

export default function LanceModal({ leilao, onFechar, onSucesso }) {
    const valorMinimoPermitido = calcularValorMinimoPermitido(leilao);

    const [valor, setValor] = useState(valorMinimoPermitido.toFixed(2));
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();

        const aoTeclar = (event) => {
            if (event.key === "Escape") onFechar();
        };
        document.addEventListener("keydown", aoTeclar);
        return () => document.removeEventListener("keydown", aoTeclar);
    }, [onFechar]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErro("");

        const valorNumerico = Number(valor);
        if (!valor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
            setErro("Informe um valor de lance válido.");
            return;
        }
        if (valorNumerico < valorMinimoPermitido) {
            setErro(`O lance deve ser de no mínimo ${formatarValor(valorMinimoPermitido)}.`);
            return;
        }

        setEnviando(true);
        lanceService.registrar(leilao.id, valorNumerico)
            .then((response) => onSucesso(response.data))
            .catch((error) => {
                
                setErro(error.response?.data?.message || "Não foi possível registrar o lance.");
            })
            .finally(() => setEnviando(false));
    };

    return (
        <div className="lance-modal-overlay" onClick={onFechar}>
            <div
                className="lance-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lance-modal-titulo"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="lance-modal-fechar"
                    onClick={onFechar}
                    aria-label="Fechar"
                >
                    ×
                </button>

                <h2 id="lance-modal-titulo">Dar lance</h2>
                <p className="lance-modal-leilao">{leilao.titulo}</p>

                <dl className="lance-modal-resumo">
                    <div>
                        <dt>Lance mínimo</dt>
                        <dd>{formatarValor(leilao.lanceMinimo)}</dd>
                    </div>
                    <div>
                        <dt>Lance atual</dt>
                        <dd>{leilao.maiorLance != null ? formatarValor(leilao.maiorLance) : "Nenhum lance"}</dd>
                    </div>
                    <div>
                        <dt>Incremento</dt>
                        <dd>{formatarValor(leilao.valorIncremento)}</dd>
                    </div>
                </dl>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="lance-valor">Seu lance (R$)</label>
                    <input
                        id="lance-valor"
                        ref={inputRef}
                        type="number"
                        inputMode="decimal"
                        min={valorMinimoPermitido}
                        step="0.01"
                        value={valor}
                        onChange={(event) => setValor(event.target.value)}
                        disabled={enviando}
                    />
                    <small className="lance-modal-dica">
                        Valor mínimo permitido: <strong>{formatarValor(valorMinimoPermitido)}</strong>
                    </small>

                    {erro && <p className="lance-modal-erro">{erro}</p>}

                    <div className="lance-modal-acoes">
                        <button type="button" className="botao-cancelar" onClick={onFechar} disabled={enviando}>
                            Cancelar
                        </button>
                        <button type="submit" className="botao-confirmar-lance" disabled={enviando}>
                            {enviando ? "Enviando..." : "Confirmar lance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
