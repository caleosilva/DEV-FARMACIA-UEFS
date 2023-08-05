import idSheet from './env';
import formatarData from '../client/dialog-demo-bootstrap/Functions/formatarData';
// import { buscaBinariaSimples } from './geral';


const ordenarPlanilha = (nomeDaAba, colunaBase) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName(nomeDaAba);
    var range = ws.getDataRange().offset(1, 0); // começa na segunda linha
    range.sort(colunaBase);// ordena a faixa de células com base na coluna 1 (A)
}

const buscaBinariaSimples = (nomePlanilha, valorBuscado, colBusca) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName(nomePlanilha);

    var lr = ws.getLastRow();

    if (lr > 1) {
        var values = ws.getRange(2, colBusca, lr - 1, 1).getValues();
        var lowerBound = 0;
        var upperBound = values.length - 1;

        while (lowerBound <= upperBound) {
            var middle = Math.floor((lowerBound + upperBound) / 2);
            var value = values[middle][0];

            if (value == valorBuscado) {
                var linhaReal = middle + 2
                var info = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                return { linha: linhaReal, data: info }

            } else if (value < valorBuscado) {
                lowerBound = middle + 1;
            } else {
                upperBound = middle - 1;
            }
        }
    } else {
        return false;
    }
    return null;
}

const atualizarQuantidadeEstoque = (medEspecificoChaveGeral, medEspecificoChaveMedicamentoGeral, novaQuantidade, quantidade) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    // Encontrando o medicamento específico:
    var dados = buscaBinariaSimples("MedicamentoEspecifico", medEspecificoChaveGeral, 12);

    if (dados) {
        //Atualiza na tabela MedicamentoEspecifico
        ws.getRange("F" + parseInt(dados.linha)).setValue(novaQuantidade);

        // Abre a planilha Medicamentos
        var wsMed = ss.getSheetByName("Medicamentos");
        var dadosMed = buscaBinariaSimples("Medicamentos", medEspecificoChaveMedicamentoGeral, 1);


        var quantidadeMed = wsMed.getRange("H" + parseInt(dadosMed.linha)).getValue();
        var novaQuantidadeMed = parseInt(quantidadeMed) - parseInt(quantidade);
        wsMed.getRange("H" + parseInt(dadosMed.linha)).setValue(novaQuantidadeMed);
        return true;
    }

    return false;
}

const atualizarChavePacienteNoEstoque = (chavePaciente, novaChavePaciente) => {
    var ssEstoque = SpreadsheetApp.openById(idSheet);
    var wsEstoque = ssEstoque.getSheetByName("Estoque");

    var lr = wsEstoque.getLastRow();

    if (lr > 1) {
        var data = wsEstoque.getRange("H2:H" + lr).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == chavePaciente) {
                wsEstoque.getRange(i + 2, 8).setValue(novaChavePaciente);
            }
        }
    }
}

export const getPacientes = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Pacientes");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();
        var informacoes = [];

        if (data.length == 0) {
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            var info = {
                'chavePaciente': data[i][0],
                'nome': data[i][1],
                'cpf': data[i][2],
                'dataNascimento': data[i][3],
                'telefone': data[i][4],
                'tipoPaciente': data[i][5],
                // 'complemento': data[i][6],
                'sexo': data[i][6],
                'estadoCivil': data[i][7],
                'cidade': data[i][8],
                'bairro': data[i][9],
                'endereco': data[i][10],
                'numero': data[i][11],
                'comoSoube': data[i][12],
                'nivelEscolaridade': data[i][13],
                'profissao': data[i][14],
                'nomeSocial': data[i][15],
                'identidadeGenero': data[i][16]
            }
            informacoes.push(info);
        }

        return JSON.stringify(informacoes);
    } else {
        return false
    }
}

export const appendRowPacientes = (paciente) => {

    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Pacientes");

    // Verificando se o paciente existe:
    var codigo = paciente.chavePaciente;

    var resultadoBuscaPorPaciente = buscaBinariaSimples("Pacientes", codigo, 1);

    if (resultadoBuscaPorPaciente) {
        return false;
    } else {
        let dataNascimento = formatarData(paciente.dataNascimento);
        ws.appendRow([
            paciente.chavePaciente,
            paciente.nome,
            paciente.cpf,
            dataNascimento,
            paciente.telefone,
            paciente.tipoPaciente,
            paciente.sexo,
            paciente.estadoCivil,
            paciente.cidade,
            paciente.bairro,
            paciente.endereco,
            paciente.numero,
            paciente.comoSoube,
            paciente.nivelEscolaridade,
            paciente.profissao,
            paciente.nomeSocial,
            paciente.identidadeGenero,
            paciente.chaveUsuario
        ]);

        ordenarPlanilha("Pacientes", 1)
        return true;
    }
}

export const removeRowPaciente = (paciente) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Pacientes");

    // Encontrando o paciente:
    var codigo = paciente.chavePaciente;
    var dados = buscaBinariaSimples("Pacientes", codigo, 1);

    if (dados) {
        let linha = dados.linha;
        ws.deleteRow(linha);
        return true;
    }
    return false;
}

export const updateRowPaciente = (paciente) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Pacientes");

    // Formatanto a data e pegando novo código
    var dataNascimentoFormatada = formatarData(paciente.dataNascimento);
    var novaChavePaciente = paciente.cpf;

    // Lista com os novos dados:
    var novosDados = []

    // Verifica se a nova chave (se for o caso) é válida e preenche a lista com os novos dados
    if (paciente.cpf !== paciente.chavePaciente) {

        const resultadoBusca = buscaBinariaSimples("Pacientes", novaChavePaciente, 1);

        if (resultadoBusca) {
            return false;
        } else {
            novosDados = [novaChavePaciente, paciente.nome, paciente.cpf, dataNascimentoFormatada, paciente.telefone, paciente.tipoPaciente, paciente.sexo, paciente.estadoCivil, paciente.cidade, paciente.bairro, paciente.endereco, paciente.numero, paciente.comoSoube, paciente.nivelEscolaridade, paciente.profissao, paciente.nomeSocial, paciente.identidadeGenero];
        }
        // A chave continua a mesma
    } else {
        novosDados = [paciente.chavePaciente, paciente.nome, paciente.cpf, dataNascimentoFormatada, paciente.telefone, paciente.tipoPaciente, paciente.sexo, paciente.estadoCivil, paciente.cidade, paciente.bairro, paciente.endereco, paciente.numero, paciente.comoSoube, paciente.nivelEscolaridade, paciente.profissao, paciente.nomeSocial, paciente.identidadeGenero];
    }

    var chavePacienteOriginal = paciente.chavePaciente;

    // Acha a linha que os dados originais estão:
    var buscaChaveOriginal = buscaBinariaSimples('Pacientes', chavePacienteOriginal, 1);

    if (buscaChaveOriginal) {
        // Atualiza e ordena a tabela
        ws.getRange('A' + buscaChaveOriginal.linha + ':Q' + buscaChaveOriginal.linha).setValues([novosDados]);
        ordenarPlanilha('Pacientes', 1);

        if (paciente.cpf !== paciente.chavePaciente){
            atualizarChavePacienteNoEstoque(paciente.chavePaciente, paciente.cpf);
        }

        return true;
    }
}

export const saidaPorPaciente = (dados) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Estoque");

    // Atualizar a quantidade:
    const retornoAtualizacao = atualizarQuantidadeEstoque(dados.chaveGeralMedicamentoEspecifico, dados.chaveMedicamentoGeral, dados.novaQuantidade, dados.quantidade);

    if (retornoAtualizacao) {
        // Adiciona na planilha estoque
        ws.appendRow([
            dados.dataOperacao,
            dados.quantidadeAnterior,
            dados.novaQuantidade,
            dados.motivo,
            dados.chaveMedicamentoEspecifico,
            dados.chaveMedicamentoGeral,
            dados.chaveDoador,
            dados.chavePaciente,
            dados.chaveUsuario
        ]);
    }
    return retornoAtualizacao;
}