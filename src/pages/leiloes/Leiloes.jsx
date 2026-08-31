import React, { useEffect, useMemo, useState } from "react";
import Api from "../../api/axiosInstance.js"
import { Link } from "react-router-dom";
import "./Leiloes.css";
import { API_BASE_URL } from "../../api/axiosInstance";
import { formatarData, formatarValor } from "../../utils/format";

export default function Leiloes() {
    const [leiloes, setLeiloes] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        Api
            .get("/leilao/buscar")
            .then((response) => {
                setLeiloes(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar leilões:", error);
                setErro("Não foi possível carregar os leilões.");
            })
            .finally(() => {
                setCarregando(false);
            });
    }, []);

    const leiloesFiltrados = useMemo(() => {
        const termo = busca.toLowerCase().trim();

        if (!termo) {
            return leiloes;
        }

        return leiloes.filter((leilao) => {
            return (
                leilao.titulo?.toLowerCase().includes(termo) ||
                leilao.descricao?.toLowerCase().includes(termo) ||
                leilao.status?.toLowerCase().includes(termo)
            );
        });
    }, [busca, leiloes]);

        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleDelete = (id, titulo) => {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o leilão "${titulo}"?`
        );

        if (!confirmar) return;

        Api
            .delete(`/leilao/excluir/${id}`)
            .then(() => {
                setLeiloes((leiloesAtuais) =>
                    leiloesAtuais.filter((leilao) => leilao.id !== id)
                );
            })
            .catch((error) => {
                console.error("Erro ao excluir leilão:", error);
                alert("Não foi possível excluir o leilão.");
            });
    };

    return (
        <div className="leiloes-page">
            <header className="leiloes-header">
                <Link to="/" className="leiloes-logo">
                    FarmAuction
                </Link>

                <div className="leiloes-header-acoes">
                    <Link to="/" className="botao-voltar">
                        ← Início
                    </Link>

                    <Link to="/leiloes/novo" className="botao-criar">
                        + Criar leilão
                    </Link>
                </div>
            </header>

            <main className="leiloes-container">
                <section className="leiloes-topo">
                    <div>
                        <p className="leiloes-subtitulo">
                            Leilões de animais de fazenda
                        </p>

                        <h1>Leilões disponíveis</h1>
                    </div>

                    <div className="barra-busca">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Buscar por título, descrição ou status..."
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                        />
                    </div>
                </section>

                {carregando && (
                    <div className="estado-pagina">
                        <div className="loading-spinner"></div>
                        <p>Carregando leilões...</p>
                    </div>
                )}

                {erro && !carregando && (
                    <div className="estado-erro">
                        <h3>Ocorreu um problema</h3>
                        <p>{erro}</p>
                    </div>
                )}

                {!carregando &&
                    !erro &&
                    leiloesFiltrados.length === 0 && (
                        <div className="estado-vazio">
                            <div className="estado-vazio-icone">🐄</div>

                            <h2>Nenhum leilão encontrado</h2>

                            <p>
                                Não existem leilões cadastrados ou nenhum
                                resultado corresponde à sua busca.
                            </p>

                            <Link
                                to="/leiloes/novo"
                                className="botao-criar vazio"
                            >
                                + Criar primeiro leilão
                            </Link>
                        </div>
                    )}

                {!carregando &&
                    !erro &&
                    leiloesFiltrados.length > 0 && (
                        <>
                            <div className="resultado-busca">
                                {leiloesFiltrados.length} leilão(ões)
                                encontrado(s)
                            </div>

                            <section className="leiloes-grid">
                                {leiloesFiltrados.map((leilao) => (
                                    <article
                                        className="leilao-card"
                                        key={leilao.id}
                                    >
                                        <div className="leilao-imagem">
                                            {leilao.imagens &&
                                            leilao.imagens.length > 0 ? (
                                                <img
                                                    src={`${API_BASE_URL}${leilao.imagens[0].url}`} alt="imagens"
                                                />
                                            ) : (
                                                <span>🐄</span>
                                            )}

                                            <span
                                                className={`status ${String(
                                                    leilao.status || ""
                                                ).toLowerCase()}`}
                                            >
                                                {leilao.status || "SEM STATUS"}
                                            </span>
                                        </div>

                                        <div className="leilao-card-conteudo">
                                            <h2>{leilao.titulo}</h2>

                                            <p className="leilao-descricao">
                                                {leilao.descricao}
                                            </p>

                                            <div className="leilao-informacoes">
                                                <div>
                                                    <span className="info-label">
                                                        Início
                                                    </span>
                                                    <strong>
                                                        {formatarData(
                                                            leilao.dataHoraInicio
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span className="info-label">
                                                        Encerramento
                                                    </span>
                                                    <strong>
                                                        {formatarData(
                                                            leilao.dataHoraFim
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="leilao-valores">
                                                <div>
                                                    <span>Lance mínimo</span>
                                                    <strong>
                                                        {formatarValor(
                                                            leilao.lanceMinimo
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Incremento</span>
                                                    <strong>
                                                        {formatarValor(
                                                            leilao.valorIncremento
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="leilao-acoes">
                                                <Link
                                                    to={`/leiloes/${leilao.id}`}
                                                    className="botao-detalhes"
                                                >
                                                    Ver detalhes
                                                </Link>

                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleDelete(
                                                            leilao.id,
                                                            leilao.titulo
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        </>
                    )}
            </main>
        </div>
    );