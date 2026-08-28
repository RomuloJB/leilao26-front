import { useEffect, useState } from "react";
import Api from "../api/axiosInstance";

const FORM_INICIAL = {
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
};

// onImagensCarregadas: callback opcional chamado com as imagens já salvas
// do leilão, assim que ele é carregado (só faz sentido em modo de edição).
// Fica a cargo de quem usa o hook decidir onde guardar essas imagens
// (normalmente no useImagensLeilao), mantendo os dois hooks independentes.
export default function useLeilaoForm(id, onImagensCarregadas) {
    const modoEdicao = Boolean(id);

    const [form, setForm] = useState(FORM_INICIAL);
    const [carregandoLeilao, setCarregandoLeilao] = useState(modoEdicao);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!modoEdicao) return;

        setCarregandoLeilao(true);

        Api.get(`/leilao/buscar/${id}`)
            .then((response) => {
                const leilao = response.data;

                setForm({
                    titulo: leilao.titulo || "",
                    descricao: leilao.descricao || "",
                    descricaoDetalhada: leilao.descricaoDetalhada || "",
                    dataHoraInicio: leilao.dataHoraInicio ? leilao.dataHoraInicio.slice(0, 16) : "",
                    dataHoraFim: leilao.dataHoraFim ? leilao.dataHoraFim.slice(0, 16) : "",
                    status: leilao.status || "AGENDADO",
                    observacao: leilao.observacao || "",
                    valorIncremento: leilao.valorIncremento ?? "",
                    lanceMinimo: leilao.lanceMinimo ?? "",
                    categoriaId: leilao.categoria?.id ?? "",
                });

                onImagensCarregadas?.(leilao.imagens || []);
            })
            .catch((error) => {
                console.error("Erro ao carregar leilão:", error);
                setErro("Não foi possível carregar os dados deste leilão.");
            })
            .finally(() => setCarregandoLeilao(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, modoEdicao]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((formAnterior) => ({ ...formAnterior, [name]: value }));
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

    // converte o form (strings de input) pro formato que o backend espera
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

    return {
        modoEdicao,
        form,
        handleChange,
        carregandoLeilao,
        erro,
        setErro,
        validar,
        paraPayload,
    };
}