import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function Categoria() {
    const[categorias, setCategorias] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/categoria").then(response => {
            setCategoria(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar categorias: ", error);
        });
    }, []);

    return (
        <div>
            <h1>Categorias</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Observação</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map(categoria => (
                        <tr key = {categoria.id}>
                            <td>{categoria.id}</td>
                            <td>{categoria.nome}</td>
                            <td>{categoria.observacao}</td>
                        </tr>
                    ))};
                </tbody>
            </table>
        </div>
    );
}