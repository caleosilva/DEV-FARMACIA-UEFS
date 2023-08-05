export default function dataHojeFormatada() {
    var data = new Date();

    var dia = data.getDate();
    if (dia < 10) {
        dia = '0' + dia; // Adiciona um zero à esquerda para dias menores que 10
    }

    var mes = data.getMonth() + 1; // Os meses são indexados a partir de 0, então é necessário adicionar 1
    if (mes < 10) {
        mes = '0' + mes; // Adiciona um zero à esquerda para meses menores que 10
    }

    var ano = data.getFullYear();

    var dataFormatada = dia + '-' + mes + '-' + ano;
    return dataFormatada;
}