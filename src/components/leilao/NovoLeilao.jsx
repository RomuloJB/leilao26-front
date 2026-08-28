import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../api/axiosInstance";
import "./NovoLeilao.css";

import useCategorias from "../../hooks/useCategorias";
import useImagensLeilao from "../../hooks/useImagensLeilao";
import useLeilaoForm from "../../hooks/useLeilaoForm";

import {
    SecaoInformacoes,
    SecaoPeriodo,
    SecaoValores,
    SecaoImagens,
    SecaoObservacoes,
} from "../forms/Secoes";

export default function NovoLeilao() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [salvando, setSalvando] = useState(false);

    const imagens = useImagensLeilao();
    const {
        modoEdicao,
        form,
        handleChange,
        carregandoLeilao,
        erro,
        setErro,
        validar,
        paraPayload,
    } = useLeilaoForm(id, imagens.setImagensExistentes);

    const { categorias, carregandoCategorias } = useCategorias();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // proteção extra contra clique duplo/duplo submit, além do
        // disabled do botão
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
                await Api.put(`/leilao/atualizar/${id}`, paraPayload());
            } else {
                const resultado = await Api.post("/leilao/registrar", paraPayload());
                leilaoId = resultado.data.id;
            }

            if (imagens.temNovasImagens) {
                try {
                    await imagens.enviarNovasImagens(leilaoId);
                } catch (erroImagem) {
                    console.error("Erro ao enviar imagens:", erroImagem);
                    alert(
                        "O leilão foi salvo, mas houve um problema ao enviar uma ou mais imagens. " +
                        "Você pode tentar novamente editando o leilão."
                    );
                    navigate("/leiloes/gado");
                    return;
                }
            }

            alert(modoEdicao ? "Leilão atualizado com sucesso!" : "Leilão criado com sucesso!");
            navigate("/leiloes/gado");
        } catch (error) {
            console.error("Erro ao salvar leilão:", error);
            setErro(
                error.response?.data?.message ||
                (modoEdicao
                    ? "Não foi possível salvar as alterações. Verifique os dados e tente novamente."
                    : "Não foi possível criar o leilão. Verifique os dados e tente novamente.")
            );
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
                <Link to="/" className="novo-leilao-logo">
                    FarmAuction
                </Link>

                <Link to="/leiloes/gado" className="novo-leilao-voltar">
                    ← Voltar para leilões
                </Link>
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

                    <SecaoInformacoes
                        form={form}
                        onChange={handleChange}
                        categorias={categorias}
                        carregandoCategorias={carregandoCategorias}
                    />

                    <SecaoPeriodo form={form} onChange={handleChange} />

                    <SecaoValores form={form} onChange={handleChange} />

                    <SecaoImagens
                        imagensExistentes={imagens.imagensExistentes}
                        novasImagens={imagens.novasImagens}
                        onAdicionar={imagens.adicionarImagens}
                        onRemoverExistente={imagens.removerImagemExistente}
                        onRemoverNova={imagens.removerNovaImagem}
                    />

                    <SecaoObservacoes form={form} onChange={handleChange} />

                    <div className="form-acoes">
                        <Link to="/leiloes/gado" className="botao-cancelar">
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="botao-salvar"
                            disabled={salvando || carregandoCategorias}
                        >
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