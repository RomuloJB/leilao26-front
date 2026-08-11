import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leilao() {

    const[leiloes, setLeiloes] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8080/leilao").then(response => {
            setLeilao(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar leilões: ", error);
        });
    }, []);
    
    return (
        <div>
            <h1>Leilões</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th>Descrição</th>
                        <th>Data Início</th>
                        <th>Data Fim</th>
                        <th>Status</th>
                        <th>Valor Incremento</th>
                        <th>Lance Mínimo</th>
                    </tr>
                </thead>

                <tbody>
                    {leiloes.map(leilao => (
                        <tr key = {leilao.id}>
                            <td>{leilao.titulo}</td>
                            <td>{leilao.descricao}</td>
                            <td>{leilao.dataHoraInicio}</td>
                            <td>{leilao.dataHoraFim}</td>
                            <td>{leilao.status}</td>
                            <td>{leilao.valorIncremento}</td>
                            <td>{leilao.lanceMinimo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
