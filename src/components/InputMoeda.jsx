import React, { forwardRef } from "react";
import { formatarValor } from "../utils/format";

const MAX_DIGITOS = 15;

// Input com máscara "R$ 1.000,00". Os dígitos digitados são tratados como centavos.
// `value` é um número (ou "" quando vazio) e onChange recebe { target: { name, value } }
// com value numérico, pra funcionar com o handleChange padrão dos formulários.
const InputMoeda = forwardRef(function InputMoeda({ name, value, onChange, ...props }, ref) {
    const exibido = value === "" || value == null ? "" : formatarValor(value);

    const handleChange = (event) => {
        const digitos = event.target.value.replace(/\D/g, "").slice(0, MAX_DIGITOS);
        const numero = digitos ? Number(digitos) / 100 : "";
        onChange({ target: { name, value: numero } });
    };

    return (
        <input
            {...props}
            ref={ref}
            name={name}
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={exibido}
            onChange={handleChange}
        />
    );
});

export default InputMoeda;
