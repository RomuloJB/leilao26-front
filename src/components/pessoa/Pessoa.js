import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Pessoa(){
    const[pessoas, setPessoas] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/pessoa").then(response => {
            setPessoas(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar pessoas: ", error);
        });
    }, []);

    return (
        <div>
            <h1>Pessoas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ativo</th>
                        <th>Foto Perfil</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map(pessoa => (
                        <tr key = {pessoa.id}>
                            <td>{pessoa.id}</td>
                            <td>{pessoa.nome}</td>
                            <td>{pessoa.email}</td>
                            <td>{pessoa.ativo}</td>
                            <td>pessoa.fotoPerfil</td>
                        </tr>
                    ))};
                </tbody>
            </table>
        </div>
    );
}
export default Pessoa;