import { useEffect, useState } from "react";
import Api from "../api/axiosInstance";

export default function useCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
    const [erroCategorias, setErroCategorias] = useState("");

    useEffect(() => {
        Api.get("/categoria/buscar")
            .then((response) => setCategorias(response.data))
            .catch((error) => {
                console.error("Erro ao buscar categorias:", error.response?.data || error.message);
                setErroCategorias("Não foi possível carregar as categorias.");
            })
            .finally(() => setCarregandoCategorias(false));
    }, []);

    return { categorias, carregandoCategorias, erroCategorias };
}