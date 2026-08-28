import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../api/axiosInstance";
import "./Leiloes.css";
import "./LeilaoDetalhes.css";

export default function LeilaoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [leilao, setLeilao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        Api.get(`/leilao/buscar/${id}`)
            .then((response) => setLeilao(response.data))
            .catch((error) => {
                console.error("Erro ao buscar leilão:", error);
                setErro("Não foi possível carregar o leilão.");
            })
            .finally(() => setCarregando(false));
    }, [id]);

    const handleDelete = () => {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o leilão "${leilao.titulo}"?`
        );
        if (!confirmar) return;

        Api.delete(`/leilao/excluir/${id}`)
            .then(() => navigate("/leiloes/gado"))
            .catch(() => alert("Não foi possível excluir o leilão."));
    };

    const formatarData = (data) =>
        data
            ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(data))
            : "Não informada";

    const formatarValor = (valor) =>
        valor == null
            ? "Não informado"
            : Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    if (carregando) {
        return (
            <div className="estado-pagina">
                <div className="loading-spinner"></div>
                <p>Carregando leilão...</p>
            </div>
        );
    }

    if (erro || !leilao) {
        return (
            <div className="estado-erro">
                <h3>Ocorreu um problema</h3>
                <p>{erro || "Leilão não encontrado."}</p>
                <Link to="/leiloes/gado">← Voltar para leilões</Link>
            </div>
        );
    }

    return (
        <div className="leilao-detalhes-page">
            <header className="leiloes-header">
                <Link to="/" className="leiloes-logo">FarmAuction</Link>
                <Link to="/leiloes/gado" className="botao-voltar">← Voltar para leilões</Link>
            </header>

            <main className="leilao-detalhes-container">
                <div className="leilao-detalhes-imagem">
                    {leilao.imagens?.length > 0 ? (
                        <img src={leilao.imagens[0].url} alt={leilao.titulo} />
                    ) : (
                        <span>🐄</span>
                    )}
                    <span className={`status ${String(leilao.status || "").toLowerCase()}`}>
                        {leilao.status || "SEM STATUS"}
                    </span>
                </div>

                <div className="leilao-detalhes-conteudo">
                    <h1>{leilao.titulo}</h1>
                    <p className="leilao-descricao">{leilao.descricao}</p>

                    {leilao.descricaoDetalhada && (
                        <p className="leilao-descricao-detalhada">{leilao.descricaoDetalhada}</p>
                    )}

                    <div className="leilao-informacoes">
                        <div>
                            <span className="info-label">Início</span>
                            <strong>{formatarData(leilao.dataHoraInicio)}</strong>
                        </div>
                        <div>
                            <span className="info-label">Encerramento</span>
                            <strong>{formatarData(leilao.dataHoraFim)}</strong>
                        </div>
                    </div>

                    <div className="leilao-valores">
                        <div>
                            <span>Lance mínimo</span>
                            <strong>{formatarValor(leilao.lanceMinimo)}</strong>
                        </div>
                        <div>
                            <span>Incremento</span>
                            <strong>{formatarValor(leilao.valorIncremento)}</strong>
                        </div>
                    </div>

                    {leilao.categoria?.nome && (
                        <p className="leilao-categoria">Categoria: {leilao.categoria.nome}</p>
                    )}

                    {leilao.observacao && (
                        <p className="leilao-observacao">Obs: {leilao.observacao}</p>
                    )}

                    <div className="leilao-acoes">
                        <button className="botao-excluir" onClick={handleDelete}>
                            Excluir leilão
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}