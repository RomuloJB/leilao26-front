import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function Lance() {
    const[lances, setLances] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8080/lance").then(response => {
            setLances(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar lances: ", error);
        });
    }, []);

    return (
        <div>
            <h1>Lances</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Valor do Lance</th>
                        <th>Data e Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {lances.map(lance => (
                        <tr key = {lance.id}>
                            <td>{lance.id}</td>
                            <td>{lance.valorLance}</td>
                            <td>{lance.dataHora}</td>
                        </tr>
                    ))};
                </tbody>
            </table>
        </div>
    );
}