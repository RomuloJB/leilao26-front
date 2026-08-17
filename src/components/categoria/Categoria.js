import React from 'react';

const Categoria = () => {

    const exemplosCategoria = [
        {
            "id": 1,
            "nome": "Automoveis",
            "observacao": "Carros, motos e etc."
        },

        {
            "id": 2,
            "nome": "Imóveis",
            "observacao": "Casas, apartamentos, fazendas etc."
        },

        {
            "id": 3,
            "nome": "Moveis",
            "observacao": "Armários, camas, escrivaninhas etc."
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