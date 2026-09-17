import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import leilaoService from "../../services/leilaoService";
import "./Leiloes.css";
import "./LeilaoDetalhes.css";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../api/axiosInstance";
import { formatarData, formatarValor } from "../../utils/format";
import Lance from "../../components/lance/Lance";
import ListaLances from "../../components/lance/ListaLances";

export default function LeilaoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [leilao, setLeilao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [versaoLances, setVersaoLances] = useState(0);

    const { podeGerenciarLeilao, podeExcluirLeilao, podeDarLance } = useAuth();
    const podeEditar = podeGerenciarLeilao(leilao);
    const podeExcluir = podeExcluirLeilao(leilao);

    useEffect(() => {
        leilaoService.buscarPorId(id)
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

        leilaoService.excluir(id)
            .then(() => navigate("/leiloes/gado"))
            .catch((error) => {
                console.error("Erro ao excluir leilão:", error);
                if (error.response?.status === 403) alert("Você não tem permissão para excluir este leilão.");
                else alert(error.response?.data?.message || "Não foi possível excluir o leilão.");
            });
    };

    const handleLanceRegistrado = (lance) => {
        setLeilao((atual) => ({
            ...atual,
            maiorLance: lance.valorLance,
            totalLances: (atual.totalLances || 0) + 1,
        }));
        setVersaoLances((v) => v + 1);
    };

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
                        <img src={`${API_BASE_URL}${leilao.imagens[0].url}`} alt="imagens"
 />
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
                        <div>
                            <span>Lance atual</span>
                            <strong>
                                {leilao.maiorLance != null ? formatarValor(leilao.maiorLance) : "Nenhum lance"}
                            </strong>
                        </div>
                    </div>

                    {leilao.categoriaNome && (
                        <p className="leilao-categoria">Categoria: {leilao.categoriaNome}</p>
                    )}

                    {podeEditar && (
                        <div className="leilao-acoes">
                            <Link to={`/leiloes/${id}/editar`} className="botao-detalhes">Editar leilão</Link>
                            <button
                                className="botao-excluir"
                                disabled={!podeExcluir}
                                title={podeExcluir ? undefined : "Só é possível excluir leilões encerrados ou cancelados"}
                                onClick={handleDelete}
                            >
                                Excluir leilão
                            </button>
                        </div>
                    )}

                    {podeDarLance(leilao) && (
                        <div className="leilao-acoes">
                            <Lance leilao={leilao} onLanceRegistrado={handleLanceRegistrado} />
                        </div>
                    )}

                    {leilao.observacao && (
                        <p className="leilao-observacao">Obs: {leilao.observacao}</p>
                    )}

                    <ListaLances leilaoId={leilao.id} atualizacao={versaoLances} />
                </div>
            </main>
        </div>
    );
}