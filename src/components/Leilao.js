import React, { useEffect, useState } from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Leilao() {

    const[Leilao, setLeilao] = useState(null)

    useEffect(() => {
        axios.get("http://localhost:8080/leilao").then(response => {
            setLeilao(response.data)
            console.log(response.data)
        })
    }, []);
    
    return (
        <div>Leilao</div>
    )
}
