export function formatCurrency(value){
    if(!Number.isFinite(value)){
        throw new TypeError("Valor monetário deve ser um número finito");
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}