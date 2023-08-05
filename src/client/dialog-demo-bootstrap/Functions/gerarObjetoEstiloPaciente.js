export default function gerarObjetoEstiloPaciente(paciente) {

    var chavePaciente = paciente.cpf;
    const dados = {
        chavePaciente,
        "nome": paciente.nome,
        "cpf": paciente.cpf,
        "dataNascimento": paciente.dataNascimento,
        "telefone": paciente.telefone,
        "tipoPaciente": paciente.tipoPaciente,
        "sexo": paciente.sexo,
        "estadoCivil": paciente.estadoCivil,
        "cidade": paciente.cidade,
        "bairro": paciente.bairro,
        "endereco": paciente.endereco,
        "numero": paciente.numero,
        "comoSoube": paciente.comoSoube,
        "nivelEscolaridade": paciente.nivelEscolaridade,
        "profissao": paciente.profissao,
        "nomeSocial": paciente.nomeSocial,
        "identidadeGenero": paciente.identidadeGenero

    }
    return dados
}