import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Pagamento() {
    const[pagamentos, setPagamentos] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/pagamento").then(response => {
            setPagamento(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar pagamentos: ", error);
        });
    }, [])

    return (
        <div>
            <h1>Pagamento</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Valor</th>
                        <th>Data e Hora</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {pagamentos.map(pagamento => (
                        <tr key = {pagamento.id}>
                            <td>{pagamento.id}</td>
                            <td>{pagamento.valor}</td>
                            <td>{pagamento.dataHora}</td>
                            <td>{pagamento.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}