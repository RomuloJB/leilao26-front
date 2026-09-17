import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api/axiosInstance";
import categoriaService from "../../services/categoriaService";
import leilaoService from "../../services/leilaoService";
import imagemService from "../../services/imagemService";
import { useAuth } from "../../context/AuthContext";
import "./NovoLeilao.css";

export default function NovoLeilao() {
    const { id } = useParams();
    const modoEdicao = Boolean(id);
    const navigate = useNavigate();
    const { podeGerenciarLeilao } = useAuth();

    const [categorias, setCategorias] = useState([]);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
    const [carregandoLeilao, setCarregandoLeilao] = useState(modoEdicao);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        descricaoDetalhada: "",
        dataHoraInicio: "",
        dataHoraFim: "",
        status: "AGENDADO",
        observacao: "",
        valorIncremento: "",
        lanceMinimo: "",
        categoriaId: "",
    });

    const [imagensExistentes, setImagensExistentes] = useState([]);
    const [novasImagens, setNovasImagens] = useState([]);

    useEffect(() => {
        categoriaService.buscarTodos()
            .then((response) => setCategorias(response.data))
            .catch((error) => {
                console.error("Erro ao buscar categorias:", error);
                setErro("Não foi possível carregar as categorias.");
            })
            .finally(() => setCarregandoCategorias(false));
    }, []);

    useEffect(() => {
        if (!modoEdicao) return;

        leilaoService.buscarPorId(id)
            .then((response) => {
                const leilao = response.data;

                if (!podeGerenciarLeilao(leilao)) {
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
                setImagensExistentes(leilao.imagens || []);
            })
            .catch((error) => {
                console.error("Erro ao buscar leilão:", error);
                setErro("Não foi possível carregar o leilão.");
            })
            .finally(() => setCarregandoLeilao(false));
    }, [id, modoEdicao, podeGerenciarLeilao]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((formAnterior) => ({ ...formAnterior, [name]: value }));
    };

    const handleNovasImagens = (event) => setNovasImagens(Array.from(event.target.files));

    const handleExcluirImagemExistente = (imagemId) => {
        if (!window.confirm("Excluir esta imagem?")) return;

        imagemService.excluir(imagemId)
            .then(() => setImagensExistentes((atuais) => atuais.filter((img) => img.id !== imagemId)))
            .catch(() => alert("Não foi possível excluir a imagem."));
    };

    const validar = () => {
        if (!form.titulo.trim()) return "Informe o título do leilão.";
        if (!form.descricao.trim()) return "Informe uma descrição.";
        if (!form.dataHoraInicio) return "Informe a data e hora de início.";
        if (!form.dataHoraFim) return "Informe a data e hora de encerramento.";
        if (new Date(form.dataHoraFim) <= new Date(form.dataHoraInicio)) {
            return "A data de encerramento deve ser posterior à data de início.";
        }
        if (!form.lanceMinimo || Number(form.lanceMinimo) <= 0) return "Informe um lance mínimo válido.";
        if (!form.valorIncremento || Number(form.valorIncremento) <= 0) return "Informe um valor de incremento válido.";
        if (!form.categoriaId) return "Selecione uma categoria.";
        return null;
    };

    const paraPayload = () => ({
        titulo: form.titulo,
        descricao: form.descricao,
        descricaoDetalhada: form.descricaoDetalhada,
        dataHoraInicio: form.dataHoraInicio,
        dataHoraFim: form.dataHoraFim,
        status: form.status,
        observacao: form.observacao,
        valorIncremento: Number(form.valorIncremento),
        lanceMinimo: Number(form.lanceMinimo),
        categoria: { id: Number(form.categoriaId) },
    });

    const enviarNovasImagens = async (leilaoId) => {
        for (const arquivo of novasImagens) {
            const dados = new FormData();
            dados.append("arquivo", arquivo);
            dados.append("leilaoId", leilaoId);
            try {
                await imagemService.upload(dados);
            } catch (error) {
                console.error("Erro ao enviar imagem:", error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (salvando) return;

        setErro("");

        const erroValidacao = validar();
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        setSalvando(true);

        try {
            let leilaoId = id;

            if (modoEdicao) {
                await leilaoService.atualizar(id, paraPayload());
            } else {
                const resultado = await leilaoService.criar(paraPayload());
                leilaoId = resultado.data.id;
            }

            if (novasImagens.length > 0) {
                await enviarNovasImagens(leilaoId);
            }

            alert(modoEdicao ? "Leilão atualizado com sucesso!" : "Leilão criado com sucesso!");
            navigate(`/leiloes/${leilaoId}`);
        } catch (error) {
            console.error("Erro ao salvar leilão:", error);

            if (error.response?.status === 403) {
                setErro("Você não tem permissão para editar este leilão.");
            } else {
                setErro(
                    error.response?.data?.message ||
                    (modoEdicao
                        ? "Não foi possível salvar as alterações. Verifique os dados e tente novamente."
                        : "Não foi possível criar o leilão. Verifique os dados e tente novamente.")
                );
            }
        } finally {
            setSalvando(false);
        }
    };

    if (modoEdicao && carregandoLeilao) {
        return (
            <div className="novo-leilao-page">
                <header className="novo-leilao-header">
                    <Link to="/" className="novo-leilao-logo">FarmAuction</Link>
                    <Link to="/leiloes/gado" className="novo-leilao-voltar">← Voltar para leilões</Link>
                </header>
                <main className="novo-leilao-container">
                    <p>Carregando dados do leilão...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="novo-leilao-page">
            <header className="novo-leilao-header">
                <Link to="/" className="novo-leilao-logo">FarmAuction</Link>
                <Link to="/leiloes/gado" className="novo-leilao-voltar">← Voltar para leilões</Link>
            </header>

            <main className="novo-leilao-container">
                <div className="novo-leilao-titulo">
                    <p>{modoEdicao ? "Edição" : "Novo cadastro"}</p>
                    <h1>{modoEdicao ? "Editar leilão" : "Criar novo leilão"}</h1>
                    <span>
                        {modoEdicao
                            ? "Atualize as informações do leilão e gerencie as fotos."
                            : "Preencha as informações para cadastrar um novo leilão de animais."}
                    </span>
                </div>

                <form className="novo-leilao-form" onSubmit={handleSubmit}>
                    {erro && <div className="mensagem-erro">{erro}</div>}

                    <section className="form-secao">
                        <h2>Informações do leilão</h2>
                        <div className="form-grid">
                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="titulo">Título *</label>
                                <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex.: Leilão de Gado Nelore" />
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
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                                    ))}
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

                        {modoEdicao && imagensExistentes.length > 0 && (
                            <div className="imagens-atuais">
                                {imagensExistentes.map((imagem) => (
                                    <div className="imagem-atual" key={imagem.id}>
                                        <img src={`${API_BASE_URL}${imagem.url}`} alt="Foto do leilão" />
                                        <button type="button" onClick={() => handleExcluirImagemExistente(imagem.id)}>
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-grupo form-grupo-completo">
                            <label htmlFor="imagens">{modoEdicao ? "Adicionar novas fotos" : "Fotos do leilão"}</label>
                            <input id="imagens" type="file" accept="image/*" multiple onChange={handleNovasImagens} />
                            {novasImagens.length > 0 && <span>{novasImagens.length} imagem(ns) selecionada(s)</span>}
                        </div>
                    </section>

                    <div className="form-acoes">
                        <Link to="/leiloes/gado" className="botao-cancelar">Cancelar</Link>
                        <button type="submit" className="botao-salvar" disabled={salvando || carregandoCategorias}>
                            {salvando
                                ? (modoEdicao ? "Salvando alterações..." : "Criando leilão...")
                                : (modoEdicao ? "Salvar alterações" : "Criar leilão")}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}