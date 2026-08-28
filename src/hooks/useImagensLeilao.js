import { useEffect, useState } from "react";
import Api from "../api/axiosInstance";

export default function useImagensLeilao() {
    const [imagensExistentes, setImagensExistentes] = useState([]);
    const [novasImagens, setNovasImagens] = useState([]);

    // libera a memória das prévias (blob URLs) das imagens novas ao desmontar
    useEffect(() => {
        return () => {
            novasImagens.forEach((imagem) => URL.revokeObjectURL(imagem.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const adicionarImagens = (arquivos) => {
        const novas = Array.from(arquivos || []).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        if (novas.length === 0) return;
        setNovasImagens((atuais) => [...atuais, ...novas]);
    };

    const removerNovaImagem = (index) => {
        setNovasImagens((atuais) => {
            const copia = [...atuais];
            const [removida] = copia.splice(index, 1);
            if (removida) URL.revokeObjectURL(removida.url);
            return copia;
        });
    };

    const removerImagemExistente = async (imagemId) => {
        const confirmar = window.confirm("Remover esta imagem do leilão?");
        if (!confirmar) return;

        try {
            await Api.delete(`/imagem/excluir/${imagemId}`);
            setImagensExistentes((atuais) => atuais.filter((imagem) => imagem.id !== imagemId));
        } catch (error) {
            console.error("Erro ao remover imagem:", error);
            alert("Não foi possível remover a imagem.");
        }
    };

    // sobe cada imagem nova sequencialmente, já vinculada ao leilão salvo
    const enviarNovasImagens = async (leilaoId) => {
        for (const imagem of novasImagens) {
            const dadosImagem = new FormData();
            dadosImagem.append("arquivo", imagem.file);
            dadosImagem.append("leilaoId", leilaoId);
            await Api.post("/imagem/salvar", dadosImagem);
        }
    };

    return {
        imagensExistentes,
        setImagensExistentes,
        novasImagens,
        temNovasImagens: novasImagens.length > 0,
        adicionarImagens,
        removerNovaImagem,
        removerImagemExistente,
        enviarNovasImagens,
    };
}