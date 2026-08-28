import React from "react";
import ImagemPreview, { imagemUrl } from "../imagem/ImagemPreview";

export function SecaoInformacoes({ form, onChange, categorias, carregandoCategorias }) {
    return (
        <section className="form-secao">
            <h2>Informações do leilão</h2>

            <div className="form-grid">
                <div className="form-grupo form-grupo-completo">
                    <label htmlFor="titulo">Título *</label>
                    <input
                        id="titulo"
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={onChange}
                        placeholder="Ex.: Leilão de Gado Nelore"
                    />
                </div>

                <div className="form-grupo form-grupo-completo">
                    <label htmlFor="descricao">Descrição resumida *</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={form.descricao}
                        onChange={onChange}
                        placeholder="Descreva brevemente o leilão..."
                        rows="3"
                    />
                </div>

                <div className="form-grupo form-grupo-completo">
                    <label htmlFor="descricaoDetalhada">Descrição detalhada</label>
                    <textarea
                        id="descricaoDetalhada"
                        name="descricaoDetalhada"
                        value={form.descricaoDetalhada}
                        onChange={onChange}
                        placeholder="Informe mais detalhes sobre os animais e o leilão..."
                        rows="5"
                    />
                </div>

                <div className="form-grupo">
                    <label htmlFor="categoriaId">Categoria *</label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={form.categoriaId}
                        onChange={onChange}
                        disabled={carregandoCategorias}
                    >
                        <option value="">
                            {carregandoCategorias ? "Carregando categorias..." : "Selecione uma categoria"}
                        </option>

                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-grupo">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={form.status} onChange={onChange}>
                        <option value="AGENDADO">Agendado</option>
                        <option value="ABERTO">Aberto</option>
                        <option value="ENCERRADO">Encerrado</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>
            </div>
        </section>
    );
}

export function SecaoPeriodo({ form, onChange }) {
    return (
        <section className="form-secao">
            <h2>Período do leilão</h2>

            <div className="form-grid">
                <div className="form-grupo">
                    <label htmlFor="dataHoraInicio">Data e hora de início *</label>
                    <input
                        id="dataHoraInicio"
                        type="datetime-local"
                        name="dataHoraInicio"
                        value={form.dataHoraInicio}
                        onChange={onChange}
                    />
                </div>

                <div className="form-grupo">
                    <label htmlFor="dataHoraFim">Data e hora de encerramento *</label>
                    <input
                        id="dataHoraFim"
                        type="datetime-local"
                        name="dataHoraFim"
                        value={form.dataHoraFim}
                        onChange={onChange}
                    />
                </div>
            </div>
        </section>
    );
}

export function SecaoValores({ form, onChange }) {
    return (
        <section className="form-secao">
            <h2>Valores</h2>

            <div className="form-grid">
                <div className="form-grupo">
                    <label htmlFor="lanceMinimo">Lance mínimo (R$) *</label>
                    <input
                        id="lanceMinimo"
                        type="number"
                        name="lanceMinimo"
                        value={form.lanceMinimo}
                        onChange={onChange}
                        placeholder="0,00"
                        min="0.01"
                        step="0.01"
                    />
                </div>

                <div className="form-grupo">
                    <label htmlFor="valorIncremento">Incremento mínimo (R$) *</label>
                    <input
                        id="valorIncremento"
                        type="number"
                        name="valorIncremento"
                        value={form.valorIncremento}
                        onChange={onChange}
                        placeholder="0,00"
                        min="0.01"
                        step="0.01"
                    />
                </div>
            </div>
        </section>
    );
}

export function SecaoImagens({
    imagensExistentes,
    novasImagens,
    onAdicionar,
    onRemoverExistente,
    onRemoverNova,
}) {
    return (
        <section className="form-secao">
            <h2>Fotos do leilão</h2>

            {imagensExistentes.length > 0 && (
                <div className="imagens-grid">
                    {imagensExistentes.map((imagem) => (
                        <ImagemPreview
                            key={`existente-${imagem.id}`}
                            src={imagemUrl(imagem.id)}
                            alt={imagem.nomeImagem || "Foto do leilão"}
                            onRemover={() => onRemoverExistente(imagem.id)}
                        />
                    ))}
                </div>
            )}

            {novasImagens.length > 0 && (
                <div className="imagens-grid">
                    {novasImagens.map((imagem, index) => (
                        <ImagemPreview
                            key={imagem.url}
                            src={imagem.url}
                            alt={`Nova foto ${index + 1}`}
                            nova
                            onRemover={() => onRemoverNova(index)}
                        />
                    ))}
                </div>
            )}

            <label className="botao-adicionar-imagem" htmlFor="imagens">
                + Adicionar fotos
            </label>

            <input
                id="imagens"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                    onAdicionar(event.target.files);
                    event.target.value = ""; // permite escolher o mesmo arquivo de novo, se quiser
                }}
                className="input-imagem-oculto"
            />

            <p className="imagens-dica">
                Você pode selecionar várias fotos de uma vez. Formatos aceitos: JPG, PNG e afins.
            </p>
        </section>
    );
}

export function SecaoObservacoes({ form, onChange }) {
    return (
        <section className="form-secao">
            <h2>Informações adicionais</h2>

            <div className="form-grupo">
                <label htmlFor="observacao">Observações</label>
                <textarea
                    id="observacao"
                    name="observacao"
                    value={form.observacao}
                    onChange={onChange}
                    placeholder="Informações adicionais sobre o leilão..."
                    rows="4"
                />
            </div>
        </section>
    );
}