export function formatarData(data) {
    if (!data) return "Não informada";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(data));
}

export function formatarValor(valor) {
    if (valor === null || valor === undefined) {
        return "Não informado";
    }

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}