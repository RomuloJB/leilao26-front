import React, {useState, useEffect} from 'react';
import Api from '../../api/axiosInstance';

const Categoria = () => {

    const[categorias, setCategorias] = useState([]);

    useEffect(() => {
        Api.get("/categoria").then(response => {
            setCategorias(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error("Não foi possivel encontrar categorias: ", error);
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
                        <th>Observações</th>
                    </tr>
                </thead>

                <tbody>
                    {categorias.map(categoria => 
                        <tr key= {categoria.id}>
                            <td>{categoria.id}</td>
                            <td>{categoria.nome}</td>
                            <td>{categoria.observacao}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

}

export default Categoria;