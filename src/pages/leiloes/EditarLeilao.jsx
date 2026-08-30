import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api, { API_BASE_URL } from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "../../components/leilao/NovoLeilao.css";

export default function EditarLeilao() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [imagensAtuais, setImagensAtuais] = useState([]);
    const [novasImagens, setNovasImagens] = useState([]);

    const [form, setForm] = useState({
        titulo: "", descricao: "", descricaoDetalhada: "",
        dataHoraInicio: "", dataHoraFim: "", status: "AGENDADO",
        observacao: "", valorIncremento: "", lanceMinimo: "", categoriaId: "",
    });

    useEffect(() => {
        Api.get("/categoria/buscar")
            .then((r) => setCategorias(r.data))
            .catch(() => setErro("Não foi possível carregar as categorias."))
            .finally(() => setCarregandoCategorias(false));
    }, []);

    useEffect(() => {
        Api.get(`/leilao/buscar/${id}`)
            .then((response) => {
                const leilao = response.data;
                const semPermissao = leilao.vendedorId !== usuario?.id && !usuario?.roles?.includes("ADMIN");

                if (semPermissao) {
                    setErro("Você não tem permissão para editar este leilão.");
                    return;
                }

                setForm({
                    titulo: leilao.titulo || "",
                    descricao: leilao.descricao || "",
                    descricaoDetalhada: leilao.descricaoDetalhada || "",
                    dataHoraInicio: leilao.dataHoraInicio?.slice(0, 16) || "",
                    dataHoraFim: leilao.dataHoraFim?.slice(0, 16) || "",
                    status: leilao.status || "AGENDADO",
                    observacao: leilao.observacao || "",
                    valorIncremento: leilao.valorIncremento ?? "",
                    lanceMinimo: leilao.lanceMinimo ?? "",
                    categoriaId: leilao.categoriaId ?? "",
                });
                setImagensAtuais(leilao.imagens || []);
            })
            .catch(() => setErro("Não foi possível carregar o leilão."))
            .finally(() => setCarregando(false));
    }, [id, usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleNovasImagens = (e) => setNovasImagens(Array.from(e.target.files));

    const handleExcluirImagemAtual = (imagemId) => {
        if (!window.confirm("Excluir esta imagem?")) return;
        Api.delete(`/imagem/excluir/${imagemId}`)
            .then(() => setImagensAtuais((atuais) => atuais.filter((i) => i.id !== imagemId)))
            .catch(() => alert("Não foi possível excluir a imagem."));
    };

    const validarFormulario = () => {
        if (!form.titulo.trim()) return "Informe o título do leilão.";
        if (!form.descricao.trim()) return "Informe uma descrição.";
        if (!form.dataHoraInicio) return "Informe a data e hora de início.";
        if (!form.dataHoraFim) return "Informe a data e hora de encerramento.";
        if (new Date(form.dataHoraFim) <= new Date(form.dataHoraInicio)) return "A data de encerramento deve ser posterior à data de início.";
        if (!form.lanceMinimo || Number(form.lanceMinimo) <= 0) return "Informe um lance mínimo válido.";
        if (!form.valorIncremento || Number(form.valorIncremento) <= 0) return "Informe um valor de incremento válido.";
        if (!form.categoriaId) return "Selecione uma categoria.";
        return null;
    };

    const enviarNovasImagens = async () => {
        for (const arquivo of novasImagens) {
            const dados = new FormData();
            dados.append("arquivo", arquivo);
            dados.append("leilaoId", id);
            try {
                await Api.post("/imagem/upload", dados);
            } catch (error) {
                console.error("Erro ao enviar imagem:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        const erroValidacao = validarFormulario();
        if (erroValidacao) { setErro(erroValidacao); return; }

        setSalvando(true);
        const leilaoAtualizado = {
            titulo: form.titulo, descricao: form.descricao, descricaoDetalhada: form.descricaoDetalhada,
            dataHoraInicio: form.dataHoraInicio, dataHoraFim: form.dataHoraFim, status: form.status,
            observacao: form.observacao, valorIncremento: Number(form.valorIncremento),
            lanceMinimo: Number(form.lanceMinimo), categoria: { id: Number(form.categoriaId) },
        };

        try {
            await Api.put(`/leilao/atualizar/${id}`, leilaoAtualizado);
            if (novasImagens.length > 0) await enviarNovasImagens();
            alert("Leilão atualizado com sucesso!");
            navigate(`/leiloes/${id}`);
        } catch (error) {
            if (error.response?.status === 403) setErro("Você não tem permissão para editar este leilão.");
            else setErro(error.response?.data?.message || "Não foi possível atualizar o leilão.");
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) return <div className="estado-pagina"><div className="loading-spinner"></div><p>Carregando leilão...</p></div>;
    if (erro && !form.titulo) return (
        <div className="estado-erro">
            <h3>Ocorreu um problema</h3><p>{erro}</p>
            <Link to="/leiloes/gado">← Voltar para leilões</Link>
        </div>
    );

    return (
        <div className="novo-leilao-page">
            <header className="novo-leilao-header">
                <Link to="/" className="novo-leilao-logo">FarmAuction</Link>
                <Link to={`/leiloes/${id}`} className="novo-leilao-voltar">← Voltar para o leilão</Link>
            </header>
            <main className="novo-leilao-container">
                <div className="novo-leilao-titulo">
                    <p>Edição</p><h1>Editar leilão</h1><span>Atualize as informações do leilão.</span>
                </div>
                <form className="novo-leilao-form" onSubmit={handleSubmit}>
                    {erro && <div className="mensagem-erro">{erro}</div>}

                    <section className="form-secao">
                        <h2>Informações do leilão</h2>
                        <div className="form-grid">
                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="titulo">Título *</label>
                                <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} />
                            </div>
                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="descricao">Descrição resumida *</label>
                                <textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} rows="3" />
                            </div>
                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="descricaoDetalhada">Descrição detalhada</label>
                                <textarea id="descricaoDetalhada" name="descricaoDetalhada" value={form.descricaoDetalhada} onChange={handleChange} rows="5" />
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="categoriaId">Categoria *</label>
                                <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange} disabled={carregandoCategorias}>
                                    <option value="">{carregandoCategorias ? "Carregando categorias..." : "Selecione uma categoria"}</option>
                                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="status">Status</label>
                                <select id="status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="AGENDADO">Agendado</option>
                                    <option value="ABERTO">Aberto</option>
                                    <option value="ENCERRADO">Encerrado</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Período do leilão</h2>
                        <div className="form-grid">
                            <div className="form-grupo">
                                <label htmlFor="dataHoraInicio">Data e hora de início *</label>
                                <input id="dataHoraInicio" type="datetime-local" name="dataHoraInicio" value={form.dataHoraInicio} onChange={handleChange} />
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="dataHoraFim">Data e hora de encerramento *</label>
                                <input id="dataHoraFim" type="datetime-local" name="dataHoraFim" value={form.dataHoraFim} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Valores</h2>
                        <div className="form-grid">
                            <div className="form-grupo">
                                <label htmlFor="lanceMinimo">Lance mínimo (R$) *</label>
                                <input id="lanceMinimo" type="number" name="lanceMinimo" value={form.lanceMinimo} onChange={handleChange} min="0.01" step="0.01" />
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="valorIncremento">Incremento mínimo (R$) *</label>
                                <input id="valorIncremento" type="number" name="valorIncremento" value={form.valorIncremento} onChange={handleChange} min="0.01" step="0.01" />
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Informações adicionais</h2>
                        <div className="form-grupo">
                            <label htmlFor="observacao">Observações</label>
                            <textarea id="observacao" name="observacao" value={form.observacao} onChange={handleChange} rows="4" />
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Imagens</h2>
                        {imagensAtuais.length > 0 && (
                            <div className="imagens-atuais">
                                {imagensAtuais.map((imagem) => (
                                    <div className="imagem-atual" key={imagem.id}>
                                        <img src={`${API_BASE_URL}${imagem.url}`} alt="Foto do leilão" />
                                        <button type="button" onClick={() => handleExcluirImagemAtual(imagem.id)}>Remover</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="form-grupo form-grupo-completo">
                            <label htmlFor="imagens">Adicionar novas fotos</label>
                            <input id="imagens" type="file" accept="image/*" multiple onChange={handleNovasImagens} />
                            {novasImagens.length > 0 && <span>{novasImagens.length} imagem(ns) selecionada(s)</span>}
                        </div>
                    </section>

                    <div className="form-acoes">
                        <Link to={`/leiloes/${id}`} className="botao-cancelar">Cancelar</Link>
                        <button type="submit" className="botao-salvar" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}