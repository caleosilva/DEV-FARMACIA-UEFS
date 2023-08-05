import idSheet from './env';
import formatarData from '../client/dialog-demo-bootstrap/Functions/formatarData';
import gerarHashCode from '../client/dialog-demo-bootstrap/Functions/gerarHashCode';


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
            console.log(value);
            console.log(valorBuscado == value);

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

const atualizarChaveDoadorNoEstoque = (chaveDoador, novaChaveDoador) => {
    var ssEstoque = SpreadsheetApp.openById(idSheet);
    var wsEstoque = ssEstoque.getSheetByName("Estoque");

    var lr = wsEstoque.getLastRow();

    if (lr > 1) {
        var data = wsEstoque.getRange("G2:G" + lr).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == chaveDoador) {
                wsEstoque.getRange(i + 2, 7).setValue(novaChaveDoador);
            }
        }
    }
}

export const getDoadores = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Doador");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        var informacoes = [];

        if (data.length == 0) {
            return false;
        }

        for (let i = 0; i < data.length; i++) {
            var info = {
                'chaveDoador': data[i][0],
                'nome': data[i][1],
                'tipoDoador': data[i][2],
                'cidade': data[i][3],
                'bairro': data[i][4],
                'endereco': data[i][5],
                'numero': data[i][6],
                'comoSoube': data[i][7],
                'cnpj': data[i][8],
                'cpf': data[i][9],
                'dataNascimento': data[i][10],
                'sexo': data[i][11],
                'estadoCivil': data[i][12],
                'nomeSocial': data[i][13],
                'identidadeGenero': data[i][14]
            }
            informacoes.push(info);
        }
        return JSON.stringify(informacoes);

    } else {
        return false
    }
}

export const appendRowDoadores = (doador) => {

    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Doador");

    // Verificando se o doador existe:
    var codigo = doador.chaveDoador;

    var buscaPorDoador = buscaBinariaSimples("Doador", codigo, 1);

    if (buscaPorDoador) {
        return false;
    } else {
        let dataNascimento = formatarData(doador.dataNascimento);
        ws.appendRow([
            doador.chaveDoador,
            doador.nome,
            doador.tipoDoador,
            doador.cidade,
            doador.bairro,
            doador.endereco,
            doador.numero,
            doador.comoSoube,
            doador.cnpj,
            doador.cpf,
            dataNascimento,
            doador.sexo,
            doador.estadoCivil,
            doador.nomeSocial,
            doador.identidadeGenero,
            doador.chaveUsuario,

        ]);
        ordenarPlanilha("Doador", 1)
        return true;
    }
}

export const removeRowDoador = (doador) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Doador");

    // Encontrando o doador:
    var codigo = doador.chaveDoador;
    var dados = buscaBinariaSimples("Doador", codigo, 1);

    if (dados) {
        let linha = dados.linha;
        ws.deleteRow(linha);
        return true;
    }
    return false;
}

export const updateRowDoador = (doador) => {

    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Doador");

    // Formatanto a data e pegando novo código
    var dataNascimentoFormatada = formatarData(doador.dataNascimento);
    var chaveMudou = false;


    // Lista com os novos dados:
    var novosDados = []

    var novaChaveDoador;
    if (doador.tipoDoador === "Outro") {

        var nomeLimpo = doador.nome.toString().replace(/\s/g, '').toLowerCase();

        novaChaveDoador = gerarHashCode(nomeLimpo);
        if (doador.chaveDoador !== novaChaveDoador) chaveMudou = true;

    } else if (doador.tipoDoador === "Pessoa jurídica") {

        novaChaveDoador = gerarHashCode(doador.cnpj);
        if (doador.chaveDoador !== novaChaveDoador) chaveMudou = true;

    } else if (doador.tipoDoador === "Pessoa física") {

        novaChaveDoador = gerarHashCode(doador.cpf);
        if (doador.chaveDoador !== novaChaveDoador) chaveMudou = true;
    }

    if (chaveMudou) {
        // Verifica se a nova chave já existe:
        const resultadoBusca = buscaBinariaSimples("Doador", novaChaveDoador, 1);
        if (resultadoBusca) {
            return false;
        } else {
            novosDados = [novaChaveDoador, doador.nome, doador.tipoDoador, doador.cidade, doador.bairro, doador.endereco, doador.numero, doador.comoSoube, doador.cnpj, doador.cpf, dataNascimentoFormatada, doador.sexo, doador.estadoCivil, doador.nomeSocial, doador.identidadeGenero];
        }
    } else {
        novosDados = [doador.chaveDoador, doador.nome, doador.tipoDoador, doador.cidade, doador.bairro, doador.endereco, doador.numero, doador.comoSoube, doador.cnpj, doador.cpf, dataNascimentoFormatada, doador.sexo, doador.estadoCivil, doador.nomeSocial, doador.identidadeGenero];
    }

    var chaveDoadorOriginal = doador.chaveDoador;

    // Acha a linha que os dados originais estão:
    var buscaChaveOriginal = buscaBinariaSimples('Doador', chaveDoadorOriginal, 1);

    if (buscaChaveOriginal) {
        // Atualiza e ordena a tabela
        ws.getRange('A' + buscaChaveOriginal.linha + ':O' + buscaChaveOriginal.linha).setValues([novosDados]);
        ordenarPlanilha('Doador', 1)

        if (chaveMudou){
            atualizarChaveDoadorNoEstoque(chaveDoadorOriginal, novaChaveDoador);
        }

        return true;
    }

    return null;


}