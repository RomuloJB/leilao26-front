import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NovoLeilao.css";
import Api from "../../api/axiosInstance";

export default function NovoLeilao() {
    // const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
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

   useEffect(() => {
        const token = localStorage.getItem("token"); // ajuste a chave se o AuthContext guardar com outro nome

        Api
            .get("/categoria/buscar", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            })
            .then((response) => {
                console.log("Categorias recebidas:", response.data);
                setCategorias(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar categorias:", error.response?.data || error.message);
                setErro("Não foi possível carregar as categorias.");
            })
            .finally(() => setCarregandoCategorias(false));
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((formAnterior) => ({
            ...formAnterior,
            [name]: value,
        }));
    };

    const validarFormulario = () => {
        if (!form.titulo.trim()) {
            return "Informe o título do leilão.";
        }

        if (!form.descricao.trim()) {
            return "Informe uma descrição.";
        }

        if (!form.dataHoraInicio) {
            return "Informe a data e hora de início.";
        }

        if (!form.dataHoraFim) {
            return "Informe a data e hora de encerramento.";
        }

        if (new Date(form.dataHoraFim) <= new Date(form.dataHoraInicio)) {
            return "A data de encerramento deve ser posterior à data de início.";
        }

        if (!form.lanceMinimo || Number(form.lanceMinimo) <= 0) {
            return "Informe um lance mínimo válido.";
        }

        if (!form.valorIncremento || Number(form.valorIncremento) <= 0) {
            return "Informe um valor de incremento válido.";
        }

        if (!form.categoriaId) {
            return "Selecione uma categoria.";
        }

        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErro("");

        const erroValidacao = validarFormulario();

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        setSalvando(true);

        const novoLeilao = {
            titulo: form.titulo,
            descricao: form.descricao,
            descricaoDetalhada: form.descricaoDetalhada,
            dataHoraInicio: form.dataHoraInicio,
            dataHoraFim: form.dataHoraFim,
            status: form.status,
            observacao: form.observacao,
            valorIncremento: Number(form.valorIncremento),
            lanceMinimo: Number(form.lanceMinimo),

            categoria: {
                id: Number(form.categoriaId),
            },
        };

        try {
           const result =  await Api.post("/leilao/registrar", novoLeilao)
            console.log(result)
            alert("Leilão criado com sucesso!");

            // navigate("/leiloes/gado");
        } catch (error) {
            console.error("Erro ao criar leilão:", error);

            if (error.response?.data?.message) {
                setErro(error.response.data.message);
            } else {
                setErro(
                    "Não foi possível criar o leilão. Verifique os dados e tente novamente."
                );
            }
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="novo-leilao-page">
            <header className="novo-leilao-header">
                <Link to="/" className="novo-leilao-logo">
                    FarmAuction
                </Link>

                <Link
                    to="/leiloes/gado"
                    className="novo-leilao-voltar"
                >
                    ← Voltar para leilões
                </Link>
            </header>

            <main className="novo-leilao-container">
                <div className="novo-leilao-titulo">
                    <p>Novo cadastro</p>

                    <h1>Criar novo leilão</h1>

                    <span>
                        Preencha as informações para cadastrar um novo
                        leilão de animais.
                    </span>
                </div>

                <form
                    className="novo-leilao-form"
                    onSubmit={handleSubmit}
                >
                    {erro && (
                        <div className="mensagem-erro">
                            {erro}
                        </div>
                    )}

                    <section className="form-secao">
                        <h2>Informações do leilão</h2>

                        <div className="form-grid">
                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="titulo">
                                    Título *
                                </label>

                                <input
                                    id="titulo"
                                    type="text"
                                    name="titulo"
                                    value={form.titulo}
                                    onChange={handleChange}
                                    placeholder="Ex.: Leilão de Gado Nelore"
                                />
                            </div>

                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="descricao">
                                    Descrição resumida *
                                </label>

                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={form.descricao}
                                    onChange={handleChange}
                                    placeholder="Descreva brevemente o leilão..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-grupo form-grupo-completo">
                                <label htmlFor="descricaoDetalhada">
                                    Descrição detalhada
                                </label>

                                <textarea
                                    id="descricaoDetalhada"
                                    name="descricaoDetalhada"
                                    value={form.descricaoDetalhada}
                                    onChange={handleChange}
                                    placeholder="Informe mais detalhes sobre os animais e o leilão..."
                                    rows="5"
                                />
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="categoriaId">
                                    Categoria *
                                </label>

                                <select
                                    id="categoriaId"
                                    name="categoriaId"
                                    value={form.categoriaId}
                                    onChange={handleChange}
                                    disabled={carregandoCategorias}
                                >
                                    <option value="">
                                        {carregandoCategorias
                                            ? "Carregando categorias..."
                                            : "Selecione uma categoria"}
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="AGENDADO">
                                        Agendado
                                    </option>

                                    <option value="ABERTO">
                                        Aberto
                                    </option>

                                    <option value="ENCERRADO">
                                        Encerrado
                                    </option>

                                    <option value="CANCELADO">
                                        Cancelado
                                    </option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Período do leilão</h2>

                        <div className="form-grid">
                            <div className="form-grupo">
                                <label htmlFor="dataHoraInicio">
                                    Data e hora de início *
                                </label>

                                <input
                                    id="dataHoraInicio"
                                    type="datetime-local"
                                    name="dataHoraInicio"
                                    value={form.dataHoraInicio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="dataHoraFim">
                                    Data e hora de encerramento *
                                </label>

                                <input
                                    id="dataHoraFim"
                                    type="datetime-local"
                                    name="dataHoraFim"
                                    value={form.dataHoraFim}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Valores</h2>

                        <div className="form-grid">
                            <div className="form-grupo">
                                <label htmlFor="lanceMinimo">
                                    Lance mínimo (R$) *
                                </label>

                                <input
                                    id="lanceMinimo"
                                    type="number"
                                    name="lanceMinimo"
                                    value={form.lanceMinimo}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="valorIncremento">
                                    Incremento mínimo (R$) *
                                </label>

                                <input
                                    id="valorIncremento"
                                    type="number"
                                    name="valorIncremento"
                                    value={form.valorIncremento}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-secao">
                        <h2>Informações adicionais</h2>

                        <div className="form-grupo">
                            <label htmlFor="observacao">
                                Observações
                            </label>

                            <textarea
                                id="observacao"
                                name="observacao"
                                value={form.observacao}
                                onChange={handleChange}
                                placeholder="Informações adicionais sobre o leilão..."
                                rows="4"
                            />
                        </div>
                    </section>

                    <div className="form-acoes">
                        <Link
                            to="/leiloes/gado"
                            className="botao-cancelar"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="botao-salvar"
                            disabled={
                                salvando || carregandoCategorias
                            }
                        >
                            {salvando
                                ? "Criando leilão..."
                                : "Criar leilão"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}