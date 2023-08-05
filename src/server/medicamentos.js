import idSheet from './env';
import formatarData from '../client/dialog-demo-bootstrap/Functions/formatarData';


const realizarQuery = (nomeDaAba, primeiraCol, ultimaCol, consulta) => {

    var currentDoc = SpreadsheetApp.openById(idSheet)
    var tempSheet = currentDoc.insertSheet();

    var ws = currentDoc.getSheetByName(nomeDaAba);
    var lr = ws.getLastRow();

    var targetRange = nomeDaAba + '!' + primeiraCol + '2:' + ultimaCol + lr;
    var Query = '=QUERY(' + targetRange + ';\"' + consulta + '\")';

    var pushQuery = tempSheet.getRange(1, 1).setFormula(Query);
    var pullResult = tempSheet.getDataRange().getValues();

    currentDoc.deleteSheet(tempSheet);
    return pullResult;
}

const ordenarPlanilha = (nomeDaAba, colunaBase) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName(nomeDaAba);
    var range = ws.getDataRange().offset(1, 0); // começa na segunda linha
    range.sort(colunaBase);// ordena a faixa de células com base na coluna 1 (A)
}

const buscaBinaria = (nomePlanilha, valorBuscado, colBusca, returnLinha) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName(nomePlanilha);

    var values = ws.getRange(2, colBusca, ws.getLastRow() - 1, 1).getValues();
    var lowerBound = 0;
    var upperBound = values.length - 1;

    while (lowerBound <= upperBound) {
        var middle = Math.floor((lowerBound + upperBound) / 2);
        var value = values[middle][0];

        if (value == valorBuscado) {
            var linhaReal = middle + 2
            var info = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

            if (returnLinha) {
                return middle + 2;
            } else {
                return info;
            }
        } else if (value < valorBuscado) {
            lowerBound = middle + 1;
        } else {
            upperBound = middle - 1;
        }
    }
    return false;
}

const buscaBinariaCompleta = (sheetId, nomePlanilha, valorBuscado, colBusca) => {
    var ss = SpreadsheetApp.openById(sheetId);
    var ws = ss.getSheetByName(nomePlanilha);

    const dados = ws.getDataRange().getValues();
    let resultado = [];

    let esquerda = 0;
    let direita = dados.length - 1;

    while (esquerda <= direita) {
        let meio = Math.floor((esquerda + direita) / 2);

        if (dados[meio][colBusca] === valorBuscado) {
            let linhaReal = meio + 1
            let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
            resultado.push({ linha: linhaReal, data: informacao[0] });

            // Verifique os elementos à esquerda do meio
            let esquerdaIndex = meio - 1;
            while (esquerdaIndex >= 0 && dados[esquerdaIndex][colBusca] === valorBuscado) {
                let linhaReal = esquerdaIndex + 1
                let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
                resultado.push({ linha: linhaReal, data: informacao[0] });
                esquerdaIndex--;
            }

            // Verifique os elementos à direita do meio
            let direitaIndex = meio + 1;
            while (direitaIndex < dados.length && dados[direitaIndex][colBusca] === valorBuscado) {
                let linhaReal = direitaIndex + 1
                let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
                resultado.push({ linha: linhaReal, data: informacao[0] });
                direitaIndex++;
            }

            return resultado;
        } else if (dados[meio][colBusca] < valorBuscado) {
            esquerda = meio + 1;
        } else {
            direita = meio - 1;
        }
    }
    return resultado;
}

const atualizarChaveMedicamentoGeralNoEstoque = (chaveMedicamentoGeral, novaChaveMedicamentoGeral) => {
    var ssEstoque = SpreadsheetApp.openById(idSheet);
    var wsEstoque = ssEstoque.getSheetByName("Estoque");

    var lr = wsEstoque.getLastRow();

    if (lr > 1) {
        var data = wsEstoque.getRange("F2:F" + lr).getValues();
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == chaveMedicamentoGeral) {
                wsEstoque.getRange(i + 2, 6).setValue(novaChaveMedicamentoGeral);
            }
        }
    }
}

// const atualizarChaveMedicamentoGeralNoMedicamentoEspecifico = (chaveMedicamentoGeral, novaChaveMedicamentoGeral) => {
//     var wsn = ss.getSheetByName("MedicamentoEspecifico");
//     var dados = buscaBinariaCompleta(idSheet, "MedicamentoEspecifico", chaveMedicamentoGeral, 0);

//     for (let i = 0; i < dados.length; i++) {
//         var novaChaveGeralEstoque = novaChaveMedicamentoGeral + '#' + dados[i].data[1];

//         wsn.getRange("A" + parseInt(dados[i].linha)).setValue(novaChaveMedicamentoGeral);
//         wsn.getRange("L" + parseInt(dados[i].linha)).setValue(novaChaveGeralEstoque);

//     }
//     ordenarPlanilha('MedicamentoEspecifico', 12);
// }

export const encontrarMedicamentoTabelaMedicamentos = (chaveDeBusca) => {
    var sql = "select * where A = '" + chaveDeBusca + "'";
    var dados = realizarQuery('Medicamentos', 'A', 'G', sql)

    if (dados[0][0] === '#N/A') {
        return false;
    } else {
        // var remedio = new MedicamentoGeral(data[0][0], data[0][1], data[0][2], data[0][3], data[0][4], data[0][5], data[0][6]);
        var informacoes = [];

        for (let i = 0; i < dados.length; i++) {
            // var remedio = new MedicamentoGeral(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6]);
            var remedio = {
                chaveGeral: dados[i][0],
                dataCadastro: dados[i][1],
                nome: dados[i][2],
                principioAtivo: dados[i][3],
                tarja: dados[i][4],
                classe: dados[i][5],
                apresentacao: dados[i][6]
            }
            informacoes.push(remedio)
        }
        return informacoes;
    }
}

export const getMedicamentos = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Medicamentos");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();
        var informacoes = [];

        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {

                const remedio = {
                    "chaveGeral": data[i][0],
                    "dataCadastro": data[i][1],
                    "nome": data[i][2],
                    "principioAtivo": data[i][3],
                    "classe": data[i][4],
                    "tarja": data[i][5],
                    "apresentacao": data[i][6],
                    "quantidadeTotal": data[i][7],
                    "validadeMaisProxima": data[i][8]
                }
                informacoes.push(remedio)
            }

            return JSON.stringify(informacoes);
        }
    } else {
        return false
    }
}

export const getInformacoesMedicamentos = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("InformacoesMedicamentos");
    var data = ws.getRange(2, 1, ws.getLastRow() - 1, 5).getValues();

    var informacoes = [];

    let classes = []
    let tiposMedicamentos = []
    let tarja = []
    let apresentacao = []
    let motivoDescarte = []

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {

            if (data[i][j].length > 0 && j == 0) {
                classes.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 1) {
                tiposMedicamentos.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 2) {
                tarja.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 3) {
                apresentacao.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 4) {
                motivoDescarte.push(data[i][j]);
            }
        }
    }
    informacoes.push(classes, tiposMedicamentos, tarja, apresentacao, motivoDescarte)
    return JSON.stringify(informacoes);
}

export const appendRowMedicamentos = (medicamento) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Medicamentos");

    // Verificando se o medicamento existe:
    var codigo = medicamento.chaveGeral;

    if (encontrarMedicamentoTabelaMedicamentos(codigo)) {
        return false;
    } else {
        ws.appendRow([
            medicamento.chaveGeral,
            medicamento.dataCadastro,
            medicamento.nome,
            medicamento.principioAtivo,
            medicamento.classe,
            medicamento.tarja,
            medicamento.apresentacao,
            medicamento.quantidadeTotal,
            formatarData(medicamento.validadeMaisProxima),
            medicamento.chaveUsuario
        ]);
        ordenarPlanilha("Medicamentos", 1)
        return true;
    }
}

export const updateRowMedicamentos = (medicamento) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Medicamentos");

    // Formatanto a data e pegando novo código
    var novaChaveGeral = (medicamento.nome + '#' + medicamento.principioAtivo + '#' + medicamento.apresentacao).toString().toLowerCase().replace(/\s+/g, '');

    // Lista com os novos dados:
    var novosDados = [];

    // Verifica se a chave mudou
    if (medicamento.chaveGeral !== novaChaveGeral) {

        const resultadoBusca = encontrarMedicamentoTabelaMedicamentos(novaChaveGeral);

        if (resultadoBusca) {
            return false;
        } else {
            novosDados = [novaChaveGeral, formatarData(medicamento.dataCadastro), medicamento.nome, medicamento.principioAtivo, medicamento.classe, medicamento.tarja, medicamento.apresentacao];
        }

        // A chave continua a mesma
    } else {
        novosDados = [medicamento.chaveGeral, formatarData(medicamento.dataCadastro), medicamento.nome, medicamento.principioAtivo, medicamento.classe, medicamento.tarja, medicamento.apresentacao];
    }

    var chaveMedicamentoOriginal = medicamento.chaveGeral;

    // Acha a linha que os dados originais estão:
    var posicao = buscaBinaria('Medicamentos', chaveMedicamentoOriginal, 1, true);

    if (posicao) {
        // Atualiza e ordena a tabela Medicamentos
        ws.getRange('A' + posicao + ':G' + posicao).setValues([novosDados]);
        ordenarPlanilha('Medicamentos', 1);

        // Verifica se a chave geral mudou para atualizar e reordenar as tabelas:
        if (chaveMedicamentoOriginal !== novaChaveGeral) {

            // Atualização em medicamento específico:
            // atualizarChaveMedicamentoGeralNoMedicamentoEspecifico(medicamento.chaveGeral, novaChaveGeral)
            var wsn = ss.getSheetByName("MedicamentoEspecifico");
            var dados = buscaBinariaCompleta(idSheet, "MedicamentoEspecifico", chaveMedicamentoOriginal, 0);

            for (let i = 0; i < dados.length; i++) {
                var novaChaveGeralEstoque = novaChaveGeral + '#' + dados[i].data[1];
                wsn.getRange("A" + parseInt(dados[i].linha)).setValue(novaChaveGeral);
                wsn.getRange("L" + parseInt(dados[i].linha)).setValue(novaChaveGeralEstoque);

            }
            ordenarPlanilha('MedicamentoEspecifico', 12);

            // Atualização em estoque:
            atualizarChaveMedicamentoGeralNoEstoque(medicamento.chaveGeral, novaChaveGeral);

        }
        return posicao;
    }
}