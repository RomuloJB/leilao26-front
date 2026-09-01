import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/axiosInstance";
import "./AdminCategorias.css";

const ICONES_SUGERIDOS = ["🐄", "🐎", "🐑", "🐖", "🐐", "🐓", "🐇", "🌾"];

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [form, setForm] = useState({ nome: "", observacao: "", icone: "" });

    const carregarCategorias = () => {
        setCarregando(true);
        Api.get("/categoria/buscar")
            .then((res) => setCategorias(res.data))
            .catch(() => setErro("Não foi possível carregar as categorias."))
            .finally(() => setCarregando(false));
    };

    useEffect(() => { carregarCategorias(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((atual) => ({ ...atual, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(""); setSucesso("");

        if (!form.nome.trim()) { setErro("Informe o nome da categoria."); return; }

        setSalvando(true);
        try {
            await Api.post("/categoria/registrar", {
                nome: form.nome.trim(),
                observacao: form.observacao.trim(),
                icone: form.icone.trim() || "📦",
            });
            setForm({ nome: "", observacao: "", icone: "" });
            setSucesso("Categoria criada com sucesso.");
            carregarCategorias();
        } catch (error) {
            setErro(error.response?.data?.message || "Não foi possível criar a categoria.");
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = (categoria) => {
        if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return;
        Api.delete(`/categoria/excluir/${categoria.id}`)
            .then(() => setCategorias((atuais) => atuais.filter((c) => c.id !== categoria.id)))
            .catch(() => alert("Não foi possível excluir. Verifique se ela não possui leilões vinculados."));
    };

    return (
        <div className="admin-categorias-page">
            <header className="admin-categorias-header">
                <Link to="/" className="admin-categorias-logo">FarmAuction</Link>
                <Link to="/" className="botao-voltar">← Início</Link>
            </header>

            <main className="admin-categorias-container">
                <h1>Categorias de leilões</h1>
                <p className="admin-categorias-subtitulo">
                    Crie novas categorias. Elas aparecem automaticamente na Home.
                </p>

                <form className="admin-categorias-form" onSubmit={handleSubmit}>
                    {erro && <div className="mensagem-erro">{erro}</div>}
                    {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}

                    <div className="form-grupo">
                        <label htmlFor="nome">Nome *</label>
                        <input id="nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Suínos" />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="observacao">Descrição</label>
                        <input id="observacao" name="observacao" value={form.observacao} onChange={handleChange} placeholder="Ex: Leilões de suínos de corte." />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="icone">Ícone (emoji)</label>
                        <input id="icone" name="icone" value={form.icone} onChange={handleChange} placeholder="🐖" maxLength={4} />
                        <div className="icones-sugeridos">
                            {ICONES_SUGERIDOS.map((icone) => (
                                <button type="button" key={icone} className="icone-sugerido"
                                    onClick={() => setForm((atual) => ({ ...atual, icone }))}>
                                    {icone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="botao-salvar" type="submit" disabled={salvando}>
                        {salvando ? "Salvando..." : "Criar categoria"}
                    </button>
                </form>

                <section className="admin-categorias-lista">
                    <h2>Categorias existentes</h2>
                    {carregando && <p>Carregando...</p>}
                    {!carregando && categorias.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
                    {!carregando && categorias.length > 0 && (
                        <ul>
                            {categorias.map((categoria) => (
                                <li key={categoria.id} className="admin-categoria-item">
                                    <span className="admin-categoria-icone">{categoria.icone || "📦"}</span>
                                    <div className="admin-categoria-info">
                                        <strong>{categoria.nome}</strong>
                                        <p>{categoria.observacao}</p>
                                    </div>
                                    <button className="botao-excluir" onClick={() => handleExcluir(categoria)}>
                                        Excluir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}