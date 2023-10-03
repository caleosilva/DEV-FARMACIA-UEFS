import idSheet from './env';
import gerarHashCode from '../client/dialog-demo-bootstrap/Functions/gerarHashCode';


export const getInformacoesSelect = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("InformacoesSelect");
    var data = ws.getRange(2, 1, ws.getLastRow() - 1, ws.getLastColumn()).getValues();

    var informacoes = [];

    let classes = [];
    let tiposMedicamentos = [];
    let tarja = [];
    let apresentacao = [];
    let motivoDoacao = [];

    let origemMedicamento = [];

    let tipoDoador = [];
    let sexo = [];
    let estadoCivil = [];
    let tipoPaciente = [];

    let opcaoEntradaMedicamento = [];
    let opcaoSaidaMedicamento = [];

    let comoSoube = [];

    let nivelEscolaridade = [];

    let identidadeGenero = []

    let opcoesRelatorio = [];
    let relatorioFiltroEntrada = [];
    let relatorioFiltroSaida = [];

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
                motivoDoacao.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 5) {
                origemMedicamento.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 6) {
                tipoDoador.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 7) {
                sexo.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 8) {
                estadoCivil.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 9) {
                tipoPaciente.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 10) {
                opcaoEntradaMedicamento.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 11) {
                opcaoSaidaMedicamento.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 12) {
                comoSoube.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 13) {
                nivelEscolaridade.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 14) {
                identidadeGenero.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 15) {
                opcoesRelatorio.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 16) {
                relatorioFiltroEntrada.push(data[i][j]);
            } else if (data[i][j].length > 0 && j == 17) {
                relatorioFiltroSaida.push(data[i][j]);
            }
        }
    }
    informacoes.push(classes, tiposMedicamentos, tarja, apresentacao, motivoDoacao, origemMedicamento, tipoDoador, sexo, estadoCivil, tipoPaciente, opcaoEntradaMedicamento, opcaoSaidaMedicamento, comoSoube, nivelEscolaridade, identidadeGenero, opcoesRelatorio, relatorioFiltroEntrada, relatorioFiltroSaida);

    return JSON.stringify(informacoes);
}

export const buscaBinariaSimples = (nomePlanilha, valorBuscado, colBusca) => {
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

export const formatarData = (dataRecebida) => {
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

const ordenarPlanilha = (nomeDaAba, colunaBase) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName(nomeDaAba);
    var range = ws.getDataRange().offset(1, 0); // começa na segunda linha
    range.sort(colunaBase);// ordena a faixa de células com base na coluna, Ex: 1 (A)
}

export const getConfiguracoes = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Configuracoes");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var dataConfig = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();
        var informacoes = [];

        if (dataConfig.length > 0) {
            for (i = 0; i < dataConfig.length; i++) {

                const dadosDict = {
                    "dataInicial": dataConfig[i][0]
                }
                informacoes.push(dadosDict);
            }
            return JSON.stringify(informacoes);
        }
    } else {
        return false;
    }
    return null
}

export const atualizarChavesPrimariaMedicamentos = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Medicamentos");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                var chaveGeral = data[i][0].toString().replace(/\s/g, ''); // Acessando o código atual
                var codigoHash = gerarHashCode(chaveGeral); // cria o código com base na chave
                ws.getRange("A" + (i + 2)).setValue(codigoHash);
            }
            ordenarPlanilha("Medicamentos", 1)
            return true
        }
    } else {
        return false
    }
}

export const atualizarChavesPrimariaMedicamentoEspecifico = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                var chaveMedicamentoGeral = data[i][0].toString().replace(/\s/g, '');
                var codigoHashMedicamentoGeral = gerarHashCode(chaveMedicamentoGeral); // criar o código com base na chave
                ws.getRange("A" + (i + 2)).setValue(codigoHashMedicamentoGeral);

                var chaveMedicamentoEspecifico = data[i][1].toString().replace(/\s/g, '');;
                var codigoHashChaveMedicamentoEspecifico = gerarHashCode(chaveMedicamentoEspecifico);  // criar o código com base na chave
                ws.getRange("B" + (i + 2)).setValue(codigoHashChaveMedicamentoEspecifico);
            }
            ordenarPlanilha("MedicamentoEspecifico", 1)
            return true
        }
    } else {
        return false
    }
}

export const atualizarChavesPrimariaEstoque = () => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Estoque");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                var chaveMedicamentoGeral = data[i][5].toString().replace(/\s/g, '');
                var codigoHashMedicamentoGeral = gerarHashCode(chaveMedicamentoGeral); // criar o código com base na chave
                ws.getRange("F" + (i + 2)).setValue(codigoHashMedicamentoGeral);

                var chaveMedicamentoEspecifico = data[i][4].toString().replace(/\s/g, '');;
                var codigoHashChaveMedicamentoEspecifico = gerarHashCode(chaveMedicamentoEspecifico);  // criar o código com base na chave
                ws.getRange("E" + (i + 2)).setValue(codigoHashChaveMedicamentoEspecifico);
            }
            return true
        }
    } else {
        return false
    }
}