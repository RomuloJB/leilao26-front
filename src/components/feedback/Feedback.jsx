import React, {useState, useEffect} from 'react';
import Api from '../../api/axiosInstance';

export default function Feedback(){
    const[feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        Api.get("/feedback").then(response => {
            setFeedbacks(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar feedbacks: ", error);
        });
    }, []);
    
    return (
        <div>
            <h1>Feedbacks</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Comentário</th>
                        <th>Nota</th>
                        <th>Data e hora</th>
                    </tr>
                </thead>

                <tbody>
                    {feedbacks.map(feedback => (
                        <tr key = {feedback.id}>
                            <td>{feedback.id}</td>
                            <td>{feedback.comentario}</td>
                            <td>{feedback.nota}</td>
                            <td>{feedback.dataHora}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}