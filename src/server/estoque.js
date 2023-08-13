import formatarData from '../client/dialog-demo-bootstrap/Functions/formatarData';
import idSheet from './env';
import gerarHashCode from '../client/dialog-demo-bootstrap/Functions/gerarHashCode';

const formatarDataParaTabela = (dataRecebida) => {
    // Cria um objeto Date usando a data recebida (no formato "mm/dd/aaaa")
    const data = new Date(dataRecebida);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());

    // Verifica se a data é válida
    if (isNaN(data.getTime())) {
        return dataRecebida; // Se a data for inválida, retorna a data recebida sem formatação
    }

    // Obtém os componentes do dia, mês e ano da data
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Note o +1 para obter o mês correto (janeiro é 0)
    const ano = data.getFullYear().toString();

    // Formata a data no formato "dd/mm/aaaa"
    const dataFormatada = `${dia}-${mes}-${ano}`;
    return dataFormatada;
}

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
    range.sort(colunaBase);// ordena a faixa de células com base na coluna, Ex: 1 (A)
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

const queryValidades = (chaveDeBusca) => {
    const sql = "select E where A = '" + chaveDeBusca + "'";
    var dados = realizarQuery('MedicamentoEspecifico', 'A', 'L', sql);

    if (dados[0][0] == "#N/A") {
        return false;
    } else {

        var listaValidade = [];

        for (let i = 0; i < dados.length; i++) {
            listaValidade.push(dados[i][0]);
        }
        return listaValidade;
    }
}

const encontrarMaisProxima = (listaComValidades) => {
    const currentDate = new Date();
    const dates = listaComValidades.map(dateStr => new Date(dateStr));

    let closestDate = dates[0];
    let closestDiff = Math.abs(dates[0] - currentDate);

    for (let i = 1; i < dates.length; i++) {
        const diff = Math.abs(dates[i] - currentDate);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestDate = dates[i];
        }
    }

    return formatarDataParaTabela(closestDate);
}

const definirDataMaisRecente = (MedicamentoEspecifico) => {

    const chaveMedicamentoGeral = MedicamentoEspecifico.chaveMedicamentoGeral;

    // Pegando a data mais próxima
    const listaValidades = queryValidades(chaveMedicamentoGeral);

    var dataMaisProxima;

    if (listaValidades) {
        dataMaisProxima = encontrarMaisProxima(listaValidades);
    } else {
        dataMaisProxima = '-';
    }

    var ss = SpreadsheetApp.openById(idSheet);
    var wsMed = ss.getSheetByName("Medicamentos");

    var dadosMed = buscaBinariaSimples("Medicamentos", chaveMedicamentoGeral, 1);

    wsMed.getRange("I" + parseInt(dadosMed.linha)).setValue(dataMaisProxima);
    return JSON.stringify(dadosMed);
}

const adicionarInformacoesEstoque = (dados) => {
    //Abrindo a planilha:
    var ssEstoque = SpreadsheetApp.openById(idSheet);
    var wsEstoque = ssEstoque.getSheetByName("Estoque");

    // Adiciona na planilha estoque
    wsEstoque.appendRow([
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

    return true;
}

const atualizarChaveMedicamentoEspecificoNoEstoque = (chaveMedicamentoEspecifico, novaChaveMedicamentoEspecifico) => {
    var ssEstoque = SpreadsheetApp.openById(idSheet);
    var wsEstoque = ssEstoque.getSheetByName("Estoque");

    var lr = wsEstoque.getLastRow();

    if (lr > 1) {
        var data = wsEstoque.getRange("E2:E" + lr).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == chaveMedicamentoEspecifico) {
                wsEstoque.getRange(i + 2, 5).setValue(novaChaveMedicamentoEspecifico);
            }
        }
    }
}

const getMedEspecificoChaveMedEspecifico = (chaveMedicamentoGeral, chaveMedicamentoEspecifico) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    var lr = ws.getLastRow();

    if (lr > 1) {
        const dados = ws.getRange(2, 1, lr, ws.getLastColumn()).getValues();

        let esquerda = 0;
        let direita = dados.length - 1;

        while (esquerda <= direita) {

            let meio = Math.floor((esquerda + direita) / 2);

            if (dados[meio][0] === chaveMedicamentoGeral) {

                let linhaReal = meio + 2
                let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                if (chaveMedicamentoEspecifico === informacao[0][1]) {
                    let remedio = {
                        chaveMedicamentoGeral: informacao[0][0],
                        chaveMedicamentoEspecifico: informacao[0][1],
                        lote: informacao[0][2],
                        dosagem: informacao[0][3],
                        validade: informacao[0][4],
                        quantidade: informacao[0][5],
                        origem: informacao[0][6],
                        tipo: informacao[0][7],
                        fabricante: informacao[0][8],
                        motivoDoacao: informacao[0][9],
                        dataEntrada: informacao[0][10]
                    }

                    return { linha: linhaReal, dados: remedio }
                }

                // Verifique os elementos à esquerda do meio
                let esquerdaIndex = meio - 1;
                while (esquerdaIndex >= 0 && dados[esquerdaIndex][0] === chaveMedicamentoGeral) {
                    let linhaReal = esquerdaIndex + 2;
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                    if (chaveMedicamentoEspecifico === informacao[0][1]) {
                        let remedio = {
                            chaveMedicamentoGeral: informacao[0][0],
                            chaveMedicamentoEspecifico: informacao[0][1],
                            lote: informacao[0][2],
                            dosagem: informacao[0][3],
                            validade: informacao[0][4],
                            quantidade: informacao[0][5],
                            origem: informacao[0][6],
                            tipo: informacao[0][7],
                            fabricante: informacao[0][8],
                            motivoDoacao: informacao[0][9],
                            dataEntrada: informacao[0][10]
                        }

                        return { linha: linhaReal, dados: remedio }
                    }
                    esquerdaIndex--;
                }

                // Verifique os elementos à direita do meio
                let direitaIndex = meio + 1;
                while (direitaIndex < dados.length && dados[direitaIndex][0] === chaveMedicamentoGeral) {
                    let linhaReal = direitaIndex + 2;
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                    if (chaveMedicamentoEspecifico === informacao[0][1]) {
                        let remedio = {
                            chaveMedicamentoGeral: informacao[0][0],
                            chaveMedicamentoEspecifico: informacao[0][1],
                            lote: informacao[0][2],
                            dosagem: informacao[0][3],
                            validade: informacao[0][4],
                            quantidade: informacao[0][5],
                            origem: informacao[0][6],
                            tipo: informacao[0][7],
                            fabricante: informacao[0][8],
                            motivoDoacao: informacao[0][9],
                            dataEntrada: informacao[0][10]
                        }
                        return { linha: linhaReal, dados: remedio }
                    }
                    direitaIndex++;
                }

                return false;

            } else if (dados[meio][0] < chaveMedicamentoGeral) {
                esquerda = meio + 1;
            } else {
                direita = meio - 1;
            }
        }

        return false;

    } else {
        return false;
    }
}

export const queryMedicamentoEspecifico = (chaveDeBusca) => {
    var sql = "select * where B = '" + chaveDeBusca + "'";
    var dados = realizarQuery('MedicamentoEspecifico', 'A', 'L', sql)

    if (dados[0][0] === '#N/A') {
        return false;
    } else {
        var informacoes = [];

        for (let i = 0; i < dados.length; i++) {
            var remedio = {
                chaveMedicamentoGeral: dados[i][0],
                chaveMedicamentoEspecifico: dados[i][1],
                lote: dados[i][2],
                dosagem: dados[i][3],
                validade: dados[i][4],
                quantidade: dados[i][5],
                origem: dados[i][6],
                tipo: dados[i][7],
                fabricante: dados[i][8],
                motivoDoacao: dados[i][9],
                dataEntrada: dados[i][10]
            }
            informacoes.push(remedio)
        }
        return informacoes;
    }
}

export const queryAmountIndividualMedicamento = (chaveDeBusca) => {

    const sql = "select A, F where A = '" + chaveDeBusca + "'";
    var dados = realizarQuery('MedicamentoEspecifico', 'A', 'L', sql)

    if (dados[0][0] === '#N/A') {
        return false;
    } else {
        var informacoes = [];

        for (let i = 0; i < dados.length; i++) {
            var remedio = {
                chaveMedicamentoGeral: dados[i][0],
                chaveMedicamentoEspecifico: dados[i][1],
                lote: dados[i][2],
                dosagem: dados[i][3],
                validade: dados[i][4],
                quantidade: dados[i][5],
                origem: dados[i][6],
                tipo: dados[i][7],
                fabricante: dados[i][8],
                motivoDoacao: dados[i][9],
                dataEntrada: dados[i][10]
            }
            informacoes.push(remedio)
        }
        return informacoes;
    }
}

export const buscaBinariaCompletaPelaChaveMedicamentoGeral = (valorBuscado) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    var lr = ws.getLastRow();

    if (lr > 1) {
        const dados = ws.getDataRange().getValues();
        let resultado = [];

        let esquerda = 0;
        let direita = dados.length - 1;

        while (esquerda <= direita) {
            let meio = Math.floor((esquerda + direita) / 2);

            if (dados[meio][0] === valorBuscado) {
                let linhaReal = meio + 1
                let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
                var data = {
                    chaveMedicamentoGeral: informacao[0][0],
                    chaveMedicamentoEspecifico: informacao[0][1],
                    lote: informacao[0][2],
                    dosagem: informacao[0][3],
                    validade: informacao[0][4],
                    quantidade: informacao[0][5],
                    origem: informacao[0][6],
                    tipo: informacao[0][7],
                    fabricante: informacao[0][8],
                    motivoDoacao: informacao[0][9],
                    dataEntrada: informacao[0][10]
                }
                resultado.push(data);

                // Verifique os elementos à esquerda do meio
                let esquerdaIndex = meio - 1;
                while (esquerdaIndex >= 0 && dados[esquerdaIndex][0] === valorBuscado) {
                    let linhaReal = esquerdaIndex + 1
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
                    var data = {
                        chaveMedicamentoGeral: informacao[0][0],
                        chaveMedicamentoEspecifico: informacao[0][1],
                        lote: informacao[0][2],
                        dosagem: informacao[0][3],
                        validade: informacao[0][4],
                        quantidade: informacao[0][5],
                        origem: informacao[0][6],
                        tipo: informacao[0][7],
                        fabricante: informacao[0][8],
                        motivoDoacao: informacao[0][9],
                        dataEntrada: informacao[0][10]
                    }
                    resultado.push(data);
                    esquerdaIndex--;
                }

                // Verifique os elementos à direita do meio
                let direitaIndex = meio + 1;
                while (direitaIndex < dados.length && dados[direitaIndex][0] === valorBuscado) {
                    let linhaReal = direitaIndex + 1
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();
                    var data = {
                        chaveMedicamentoGeral: informacao[0][0],
                        chaveMedicamentoEspecifico: informacao[0][1],
                        lote: informacao[0][2],
                        dosagem: informacao[0][3],
                        validade: informacao[0][4],
                        quantidade: informacao[0][5],
                        origem: informacao[0][6],
                        tipo: informacao[0][7],
                        fabricante: informacao[0][8],
                        motivoDoacao: informacao[0][9],
                        dataEntrada: informacao[0][10]
                    }
                    resultado.push(data);
                    direitaIndex++;
                }

                return resultado;
            } else if (dados[meio][0] < valorBuscado) {
                esquerda = meio + 1;
            } else {
                direita = meio - 1;
            }
        }
        return resultado;
    } else {
        return false;
    }
}

export const queryChaveMedicamentoGeral = (chaveDeBusca) => {
    var sql = "select * where A = '" + chaveDeBusca + "'";
    var dados = realizarQuery('MedicamentoEspecifico', 'A', 'L', sql)

    if (dados[0][0] === '#N/A') {
        return false;
    } else {
        var informacoes = [];

        for (let i = 0; i < dados.length; i++) {
            var data = {
                chaveMedicamentoGeral: dados[i][0],
                chaveMedicamentoEspecifico: dados[i][1],
                lote: dados[i][2],
                dosagem: dados[i][3],
                validade: dados[i][4],
                quantidade: dados[i][5],
                origem: dados[i][6],
                tipo: dados[i][7],
                fabricante: dados[i][8],
                motivoDoacao: dados[i][9],
                dataEntrada: dados[i][10]
            }
            informacoes.push(data);
        }
        return JSON.stringify(informacoes);
    }
}

export const appendRowMedicamentoEspecifico = (medicamento, infoEstoque) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    // Verificando se o medicamento existe:
    var codigo = medicamento.chaveMedicamentoEspecifico;


    if (queryMedicamentoEspecifico(codigo, "B")) {
        return false;
    } else {
        // const chaveGeral = medicamento.chaveMedicamentoGeral + '#' + medicamento.chaveMedicamentoEspecifico;
        const validadeFormatada = formatarData(medicamento.validade);
        const dataEntradaFormatada = formatarData(medicamento.dataEntrada)

        ws.appendRow([
            medicamento.chaveMedicamentoGeral,
            medicamento.chaveMedicamentoEspecifico,
            medicamento.lote,
            medicamento.dosagem,
            validadeFormatada,
            medicamento.quantidade,
            medicamento.origem,
            medicamento.tipo,
            medicamento.fabricante,
            medicamento.motivoDoacao,
            dataEntradaFormatada,
            infoEstoque.chaveUsuario
        ]);
        ordenarPlanilha("MedicamentoEspecifico", 1)

        // Atualiza a quantidade:
        var codigoMed = medicamento.chaveMedicamentoGeral;
        var wsMed = ss.getSheetByName("Medicamentos");
        var dadosMed = buscaBinariaSimples("Medicamentos", codigoMed, 1);

        var quantidadeMed = wsMed.getRange("H" + parseInt(dadosMed.linha)).getValue();
        var novaQuantidadeMed = parseInt(quantidadeMed) + parseInt(medicamento.quantidade);
        wsMed.getRange("H" + parseInt(dadosMed.linha)).setValue(novaQuantidadeMed);

        // Atualiza a validade:
        definirDataMaisRecente(medicamento);

        // Coloca os dados na aba estoque
        adicionarInformacoesEstoque(infoEstoque);

        return true;
    }
}

export const updateRowEstoque = (medicamento) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    // Formatanto a data e pegando novo código
    const validadeFormatada = formatarData(medicamento.validade);
    const dataEntradaFormatada = formatarData(medicamento.dataEntrada);

    var novaChaveMedicamentoEspecificoStr = (medicamento.lote + '#' + medicamento.dosagem + '#' + validadeFormatada).toString().toLowerCase().replace(/\s/g, '');
    var novaChaveMedicamentoEspecifico = gerarHashCode(novaChaveMedicamentoEspecificoStr);

    // Lista com os novos dados:
    var novosDados = []

    // Verifica se a chave mudou e se é válida
    if (medicamento.chaveMedicamentoEspecifico !== novaChaveMedicamentoEspecifico) {

        const resultadoBusca = queryMedicamentoEspecifico(novaChaveMedicamentoEspecifico);

        if (resultadoBusca) {
            return false;
        } else {

            novosDados = [medicamento.chaveMedicamentoGeral, novaChaveMedicamentoEspecifico, medicamento.lote, medicamento.dosagem, validadeFormatada, medicamento.quantidade, medicamento.origem, medicamento.tipo, medicamento.fabricante, medicamento.motivoDoacao, dataEntradaFormatada];
        }

        // Se a chave continuar a mesma
    } else {
        novosDados = [medicamento.chaveMedicamentoGeral, medicamento.chaveMedicamentoEspecifico, medicamento.lote, medicamento.dosagem, validadeFormatada, medicamento.quantidade, medicamento.origem, medicamento.tipo, medicamento.fabricante, medicamento.motivoDoacao, dataEntradaFormatada];
    }

    // Acha a linha que os dados originais estão:
    var buscaChaveOriginal = getMedEspecificoChaveMedEspecifico(medicamento.chaveMedicamentoGeral, medicamento.chaveMedicamentoEspecifico);

    if (buscaChaveOriginal) {
        ws.getRange('A' + buscaChaveOriginal.linha + ':K' + buscaChaveOriginal.linha).setValues([novosDados]);
        ordenarPlanilha('MedicamentoEspecifico', 1);

        // Atualiza a validade:
        definirDataMaisRecente(medicamento);

        if (medicamento.chaveMedicamentoEspecifico !== novaChaveMedicamentoEspecifico) {
            atualizarChaveMedicamentoEspecificoNoEstoque(medicamento.chaveMedicamentoEspecifico, novaChaveMedicamentoEspecifico);
        }

        return true
    }

    return null;
}

export const removeRowEstoque = (medicamento) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    // Encontrando o medicamento:
    var dados = getMedEspecificoChaveMedEspecifico(medicamento.chaveMedicamentoGeral, medicamento.chaveMedicamentoEspecifico);

    if (dados) {
        let linha = dados.linha;
        ws.deleteRow(linha);

        // Atualiza a quantidade total se for maior que 0:
        if (parseInt(medicamento.quantidade) > 0) {
            var codigoMed = medicamento.chaveMedicamentoGeral;
            var wsMed = ss.getSheetByName("Medicamentos");
            var dadosMed = buscaBinariaSimples("Medicamentos", codigoMed, 1);

            var quantidadeMed = wsMed.getRange("H" + parseInt(dadosMed.linha)).getValue();
            var novaQuantidadeMed = parseInt(quantidadeMed) - parseInt(medicamento.quantidade);
            wsMed.getRange("H" + parseInt(dadosMed.linha)).setValue(novaQuantidadeMed);
        }

        // Atualiza a data de vencimento mais próxima:
        definirDataMaisRecente(medicamento);
        return true;
    }
    return false;
}

export const atualizarQuantidadeEstoque = (medicamento, quantidadeInput, adicionar, dadosEstoque) => {
    //Abrindo a planilha:
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    // Encontrando o medicamento:
    var dados = getMedEspecificoChaveMedEspecifico(medicamento.chaveMedicamentoGeral, medicamento.chaveMedicamentoEspecifico);


    if (dados) {
        var codigoMed = medicamento.chaveMedicamentoGeral;
        var wsMed = ss.getSheetByName("Medicamentos");
        var dadosMed = buscaBinariaSimples("Medicamentos", codigoMed, 1);

        if (adicionar) {
            var novaQuantidade = parseInt(medicamento.quantidade) + parseInt(quantidadeInput);
            ws.getRange("F" + parseInt(dados.linha)).setValue(novaQuantidade);

            var quantidadeMed = wsMed.getRange("H" + parseInt(dadosMed.linha)).getValue();
            var novaQuantidadeMed = parseInt(quantidadeMed) + parseInt(quantidadeInput);
            wsMed.getRange("H" + parseInt(dadosMed.linha)).setValue(novaQuantidadeMed);
        } else {
            var novaQuantidade = parseInt(medicamento.quantidade) - parseInt(quantidadeInput);
            ws.getRange("F" + parseInt(dados.linha)).setValue(novaQuantidade);

            var quantidadeMed = wsMed.getRange("H" + parseInt(dadosMed.linha)).getValue();
            var novaQuantidadeMed = parseInt(quantidadeMed) - parseInt(quantidadeInput);
            wsMed.getRange("H" + parseInt(dadosMed.linha)).setValue(novaQuantidadeMed);
        }

        // Adiciona na tabela Estoque:
        adicionarInformacoesEstoque(dadosEstoque);
        return true;
    }

    return false;
}

export const getMedEspecificoChaveMedGeral = (valorBuscado) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("MedicamentoEspecifico");

    var lr = ws.getLastRow();

    if (lr > 1) {
        const dados = ws.getRange(2, 1, lr, ws.getLastColumn()).getValues();

        var resultado = []

        let esquerda = 0;
        let direita = dados.length - 1;

        while (esquerda <= direita) {
            let meio = Math.floor((esquerda + direita) / 2);

            if (dados[meio][0] === valorBuscado) {
                let linhaReal = meio + 2
                let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                let remedio = {
                    chaveMedicamentoGeral: informacao[0][0],
                    chaveMedicamentoEspecifico: informacao[0][1],
                    lote: informacao[0][2],
                    dosagem: informacao[0][3],
                    validade: informacao[0][4],
                    quantidade: informacao[0][5],
                    origem: informacao[0][6],
                    tipo: informacao[0][7],
                    fabricante: informacao[0][8],
                    motivoDoacao: informacao[0][9],
                    dataEntrada: informacao[0][10],
                    chaveGeral: informacao[0][11]
                }
                resultado.push(remedio);

                // Verifique os elementos à esquerda do meio
                let esquerdaIndex = meio - 1;
                while (esquerdaIndex >= 0 && dados[esquerdaIndex][0] === valorBuscado) {
                    let linhaReal = esquerdaIndex + 2
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                    let remedio = {
                        chaveMedicamentoGeral: informacao[0][0],
                        chaveMedicamentoEspecifico: informacao[0][1],
                        lote: informacao[0][2],
                        dosagem: informacao[0][3],
                        validade: informacao[0][4],
                        quantidade: informacao[0][5],
                        origem: informacao[0][6],
                        tipo: informacao[0][7],
                        fabricante: informacao[0][8],
                        motivoDoacao: informacao[0][9],
                        dataEntrada: informacao[0][10],
                        chaveGeral: informacao[0][11]
                    }

                    resultado.push(remedio);
                    esquerdaIndex--;
                }

                // Verifique os elementos à direita do meio
                let direitaIndex = meio + 1;
                while (direitaIndex < dados.length && dados[direitaIndex][0] === valorBuscado) {
                    let linhaReal = direitaIndex + 2
                    let informacao = ws.getRange(linhaReal, 1, 1, ws.getLastColumn()).getValues();

                    let remedio = {
                        chaveMedicamentoGeral: informacao[0][0],
                        chaveMedicamentoEspecifico: informacao[0][1],
                        lote: informacao[0][2],
                        dosagem: informacao[0][3],
                        validade: informacao[0][4],
                        quantidade: informacao[0][5],
                        origem: informacao[0][6],
                        tipo: informacao[0][7],
                        fabricante: informacao[0][8],
                        motivoDoacao: informacao[0][9],
                        dataEntrada: informacao[0][10],
                        chaveGeral: informacao[0][11]
                    }

                    resultado.push(remedio);
                    direitaIndex++;
                }

                if (resultado.length > 0) {
                    return JSON.stringify(resultado);
                } else {
                    return false;
                }
            } else if (dados[meio][0] < valorBuscado) {
                esquerda = meio + 1;
            } else {
                direita = meio - 1;
            }
        }
        if (resultado.length > 0) {
            return JSON.stringify(resultado);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

