import React, { useEffect, useMemo, useState } from "react";
import leilaoService from "../../services/leilaoService";
import categoriaService from "../../services/categoriaService";
import "./Leiloes.css";
import { API_BASE_URL } from "../../api/axiosInstance";
import { formatarData, formatarValor } from "../../utils/format";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Lance from "../../components/lance/Lance";

export default function Leiloes() {
    const { podeCriarLeilao, podeGerenciarLeilao, podeDarLance } = useAuth();
    const [leiloes, setLeiloes] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const { categoriaId } = useParams();
    const [categoria, setCategoria] = useState(null);

    useEffect(() => {
    setCarregando(true);
    leilaoService.buscarTodos()
        .then((res) => setLeiloes(res.data))
        .catch(() => setErro("Não foi possível carregar os leilões."))
        .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        if (!categoriaId) { setCategoria(null); return; }
        categoriaService.buscarPorId(categoriaId)
            .then((res) => setCategoria(res.data))
            .catch(() => setCategoria(null));
    }, [categoriaId]);

    const leiloesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return leiloes.filter((leilao) => {
        const pertenceCategoria = !categoriaId || String(leilao.categoriaId) === String(categoriaId);
        if (!pertenceCategoria) return false;
        if (!termo) return true;
        return (
            leilao.titulo?.toLowerCase().includes(termo) ||
            leilao.descricao?.toLowerCase().includes(termo) ||
            leilao.status?.toLowerCase().includes(termo)
        );
    });
}, [busca, leiloes, categoriaId]);
    

    const handleDelete = (id, titulo) => {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o leilão "${titulo}"?`
        );

        if (!confirmar) return;

        leilaoService
            .excluir(id)
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

    const handleLanceRegistrado = (lance) => {
        setLeiloes((leiloesAtuais) =>
            leiloesAtuais.map((leilao) =>
                leilao.id === lance.leilaoId
                    ? {
                          ...leilao,
                          maiorLance: lance.valorLance,
                          totalLances: (leilao.totalLances || 0) + 1,
                      }
                    : leilao
            )
        );
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

                    {podeCriarLeilao && (
                        <Link to="/leiloes/novo" className="botao-criar">
                            + Criar leilão
                        </Link>
                    )}
                </div>
            </header>

            <main className="leiloes-container">
                <section className="leiloes-topo">
                    <div>
                        <p className="leiloes-subtitulo">
                            Leilões de animais de fazenda
                        </p>

                        <h1>{categoria ? `Leilões de ${categoria.nome}` : "Leilões disponíveis"}</h1>
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

                            {podeCriarLeilao && (
                                <Link
                                    to="/leiloes/novo"
                                    className="botao-criar vazio"
                                >
                                    + Criar primeiro leilão
                                </Link>
                            )}
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
                                                    {leilao.maiorLance != null ? (
                                                        <>
                                                            <span>
                                                                Lance atual ({leilao.totalLances})
                                                            </span>
                                                            <strong>
                                                                {formatarValor(
                                                                    leilao.maiorLance
                                                                )}
                                                            </strong>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Lance mínimo</span>
                                                            <strong>
                                                                {formatarValor(
                                                                    leilao.lanceMinimo
                                                                )}
                                                            </strong>
                                                        </>
                                                    )}
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

                                                {podeGerenciarLeilao(leilao) && (
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
                                                )}

                                                {podeDarLance(leilao) && (
                                                    <Lance
                                                        leilao={leilao}
                                                        onLanceRegistrado={handleLanceRegistrado}
                                                    />
                                                )}
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
}