import React from 'react';

const Categoria = () => {

    const exemplosCategoria = [
        {
            "id": 1,
            "nome": "Gado",
            "observacao": "Todas as raças"
        },

        {
            "id": 2,
            "nome": "Cavalos",
            "observacao": "Todas as raças"
        },

        {
            "id": 3,
            "nome": "Ovelhas",
            "observacao": "Todas as raças"
        },
    ]

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
                    {exemplosCategoria.map(categoria => 
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