import React, { useEffect, useState } from "react";
import lanceService from "../../services/lanceService";
import { formatarData, formatarValor } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import "./Lance.css";

export default function ListaLances({ leilaoId, atualizacao = 0 }) {
    const { usuario } = useAuth();
    const [lances, setLances] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        setCarregando(true);
        lanceService.buscarPorLeilao(leilaoId)
            .then((response) => setLances(response.data))
            .catch((error) => {
                console.error("Erro ao buscar lances:", error);
                setErro("Não foi possível carregar os lances.");
            })
            .finally(() => setCarregando(false));
    }, [leilaoId, atualizacao]);

    if (carregando) return <p className="lista-lances-estado">Carregando lances...</p>;
    if (erro) return <p className="lista-lances-estado lista-lances-erro">{erro}</p>;

    return (
        <section className="lista-lances">
            <h3>Lances ({lances.length})</h3>

            {lances.length === 0 ? (
                <p className="lista-lances-estado">Este leilão ainda não recebeu lances.</p>
            ) : (
                <ol>
                    {lances.map((lance, indice) => {
                        const meu = lance.pessoaId === usuario?.id;
                        return (
                            <li
                                key={lance.id}
                                className={`lista-lances-item${indice === 0 ? " vencedor" : ""}${meu ? " meu" : ""}`}
                            >
                                <div>
                                    <strong>{formatarValor(lance.valorLance)}</strong>
                                    <span className="lista-lances-autor">
                                        {meu ? "Você" : lance.pessoaUsername}
                                    </span>
                                </div>
                                <span className="lista-lances-data">{formatarData(lance.dataHora)}</span>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}
