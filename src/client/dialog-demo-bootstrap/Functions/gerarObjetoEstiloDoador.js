import formatarData from "./formatarData";
import gerarHashCode from "./gerarHashCode";


export default function gerarObjetoEstiloDoador(doador) {

    var dataNascimentoFormatada;
    var chaveDoador;
    if (doador.tipoDoador === "Pessoa física") {
        dataNascimentoFormatada = doador.dataNascimento;
        chaveDoador = gerarHashCode(doador.cpf);
    } else if (doador.tipoDoador === 'Pessoa jurídica') {
        dataNascimentoFormatada = "-";
        chaveDoador = gerarHashCode(doador.cnpj);

    } else if (doador.tipoDoador === 'Outro') {
        dataNascimentoFormatada = "-";
        var nomeLimpo = doador.nome.toString().replace(/\s/g, '').toLowerCase();
        chaveDoador = gerarHashCode(nomeLimpo);
    }

    const dados = {
        chaveDoador,
        "nome": doador.nome,
        "tipoDoador": doador.tipoDoador,
        "cidade": doador.cidade,
        "bairro": doador.bairro,
        "endereco": doador.endereco,
        "numero": doador.numero,
        "comoSoube": doador.comoSoube,
        "cnpj": doador.cnpj,
        "cpf": doador.cpf,
        "dataNascimento": dataNascimentoFormatada,
        "sexo": doador.sexo,
        "estadoCivil": doador.estadoCivil,
        "nomeSocial": doador.nomeSocial,
        "identidadeGenero": doador.identidadeGenero
    }

    return dados
}