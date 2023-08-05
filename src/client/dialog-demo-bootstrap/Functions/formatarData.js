export default function formatarData(dataRecebida) {
    let textoData = dataRecebida.toString();
    const caracteres = [...textoData]
    const tamanho = caracteres.length;

    var data;

    if (tamanho < 8) {
        return dataRecebida;
    } else if (8 <= tamanho && tamanho <= 10) {
        const parts = dataRecebida.split('-');
        if (parts[0].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            return `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
    } else {
        data = new Date(dataRecebida);
        data.setMinutes(data.getMinutes() + data.getTimezoneOffset()); // Ajuste para o fuso horário local
    }

    var dia = data.getDate();
    if (dia < 10) {
        dia = '0' + dia;
    }

    var mes = data.getMonth() + 1;
    if (mes < 10) {
        mes = '0' + mes;
    }

    var ano = data.getFullYear();

    var dataFormatada = dia + '-' + mes + '-' + ano;
    return dataFormatada;
}