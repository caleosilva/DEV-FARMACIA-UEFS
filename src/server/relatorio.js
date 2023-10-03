import idSheet from './env';


const getInformacoesMedicamentoGeral = () => {
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
                informacoes.push(remedio);
            }
            return informacoes;
        }
    } else {
        return false;
    }
}

function getUsuarios() {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Usuario");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();
        var dadosUsuarios = []
        for (let i = 0; i < data.length; i++) {
            const infoUser = {
                chaveUsuario: data[i][0],
                nome: data[i][1],
                matricula: data[i][2],
                cpf: data[i][3],
                email: data[i][4],
                tipoUsuario: data[i][6]
            }
            dadosUsuarios.push(infoUser)
        }

        return dadosUsuarios
    }
}

function getDataInicialEDataFinal(inputInicial, inputFinal) {
    const [anoInicial, mesInicial, diaInicial] = inputInicial.split("-");
    const dateInicial = new Date(anoInicial, mesInicial - 1, diaInicial, 0, 0, 0, 0);

    const [anoFinal, mesFinal, diaFinal] = inputFinal.split("-");
    const dateFinal = new Date(anoFinal, mesFinal - 1, diaFinal, 0, 0, 0, 0);

    return { dateInicial, dateFinal };
}

function combinarDados(listaEstoque, listaMedicamentoGeral, listaUsuarios) {
    return listaEstoque.map((item1) => {

        var item1Formatado;
        if (typeof item1 === 'object' && Array.isArray(item1)) {
            item1Formatado = { 'dataOperacao': item1[0], 'quantidadeAnterior': item1[1], 'novaQuantidade': item1[2], 'motivo': item1[3], 'chaveMedicamentoEspecifico': item1[4], 'chaveMedicamentoGeral': item1[5], 'chaveDoador': item1[6], 'chavePaciente': item1[7], 'chaveUsuario': item1[8] };
        } else {
            item1Formatado = item1;
        }

        const chaveMedicamentoGeral = item1Formatado.chaveMedicamentoGeral;
        const objetolistaMedicamentoGeral = listaMedicamentoGeral.find((item2) => item2.chaveGeral === chaveMedicamentoGeral);

        if (objetolistaMedicamentoGeral) {
            const { nome, principioAtivo, apresentacao } = objetolistaMedicamentoGeral;
            item1Formatado.nome = nome;
            item1Formatado.principioAtivo = principioAtivo;
            item1Formatado.apresentacao = apresentacao;
        }


        const chaveUsuario = item1Formatado.chaveUsuario;
        const objetoUsuario = listaUsuarios.find((usuario) => usuario.chaveUsuario === chaveUsuario);

        if (objetoUsuario) {
            const nomeUsuario = objetoUsuario.nome;
            item1Formatado.nomeUsuario = nomeUsuario;
        }

        return item1Formatado;
    });
}

function dataEstaNoIntervalo(data, inicio, fim) {
    return data >= inicio && data <= fim;
}

function filtrarDadosEntradaEstoque(estoqueData, opcao, dateInicial, dateFinal, filtroDoador) {
    return estoqueData.slice(1).filter((row) => {
        const [dataOperacao, quantidadeAnterior, novaQuantidade, motivo, chaveMedicamentoEspecifico, chaveMedicamentoGeral, chaveDoador] = row;
        const dataOperacaoPura = new Date(dataOperacao);
        dataOperacaoPura.setHours(0, 0, 0, 0);

        const filtroPorOpcao = () => {
            switch (opcao) {
                case 'Todos':
                    return (
                        motivo === 'Doação' || (motivo === 'Ajuste de estoque' && parseInt(quantidadeAnterior) < parseInt(novaQuantidade))
                    );
                case 'Doação':
                    return motivo === 'Doação' && (filtroDoador === 'Todos' || filtroDoador === chaveDoador);
                case 'Ajuste de estoque':
                    return (
                        motivo === 'Ajuste de estoque' && parseInt(quantidadeAnterior) < parseInt(novaQuantidade)
                    );
                default:
                    return false;
            }
        }

        const verificaIntervalo = dataEstaNoIntervalo(dataOperacaoPura, dateInicial, dateFinal);

        return filtroPorOpcao() && verificaIntervalo;
    });
}

function filtrarDadosSaidaEstoque(estoqueData, opcao, dateInicial, dateFinal, filtroPaciente) {
    return estoqueData.slice(1).filter((row) => {
        const [dataOperacao, quantidadeAnterior, novaQuantidade, motivo, chaveMedicamentoEspecifico, chaveMedicamentoGeral, chaveDoador, chavePaciente] = row;
        const dataOperacaoPura = new Date(dataOperacao);
        dataOperacaoPura.setHours(0, 0, 0, 0);

        const filtroPorOpcao = () => {
            switch (opcao) {
                case 'Todos':
                    return motivo === 'Paciente' || motivo === 'Avaria' || motivo === 'Vencimento' || (motivo === 'Ajuste de estoque' && parseInt(quantidadeAnterior) > parseInt(novaQuantidade));
                case 'Paciente':
                    return motivo === 'Paciente' && (filtroPaciente === 'Todos' || chavePaciente === filtroPaciente);
                case 'Avaria':
                    return motivo === 'Avaria';
                case 'Vencimento':
                    return motivo === 'Vencimento';
                case 'Ajuste de estoque':
                    return motivo === 'Ajuste de estoque' && parseInt(quantidadeAnterior) > parseInt(novaQuantidade);
                default:
                    return false;
            }
        };

        const verificaIntervalo = dataEstaNoIntervalo(dataOperacaoPura, dateInicial, dateFinal);

        return filtroPorOpcao() && verificaIntervalo;
    });
}

export const relatorioSaldoDeEstoque = () => {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MedicamentoEspecifico');
    var medicamentoEspecificoData = sheet.getDataRange().getValues();

    var medicamentosSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Medicamentos');
    var medicamentosData = medicamentosSheet.getDataRange().getValues();
    var medicamentosDicionario = {};

    for (var i = 1; i < medicamentosData.length; i++) {
        var chaveMedicamentoGeral = medicamentosData[i][0];
        var nome = medicamentosData[i][2];
        var principioAtivo = medicamentosData[i][3];
        var apresentacao = medicamentosData[i][6];
        var chaveUsuario = medicamentosData[i][9];
        medicamentosDicionario[chaveMedicamentoGeral] = { nome, principioAtivo, apresentacao, chaveUsuario };
    }

    var resultado = {};
    var chavesNaoEncontradas = [];

    const listaUsuarios = getUsuarios()


    for (var i = 1; i < medicamentoEspecificoData.length; i++) {
        var chaveMedicamentoGeral = medicamentoEspecificoData[i][0];
        var quantidade = medicamentoEspecificoData[i][5];

        if (!medicamentosDicionario[chaveMedicamentoGeral]) {
            chavesNaoEncontradas.push(chaveMedicamentoGeral);
        } else {
            if (chaveMedicamentoGeral !== "") {
                if (!resultado[chaveMedicamentoGeral]) {
                    let nome = medicamentosDicionario[chaveMedicamentoGeral].nome;
                    let principioAtivo = medicamentosDicionario[chaveMedicamentoGeral].principioAtivo;
                    let apresentacao = medicamentosDicionario[chaveMedicamentoGeral].apresentacao;


                    const chaveUsuario = medicamentosDicionario[chaveMedicamentoGeral].chaveUsuario;

                    const objetoUsuario = listaUsuarios.find((usuario) => usuario.chaveUsuario === chaveUsuario);

                    resultado[chaveMedicamentoGeral] = { nome, principioAtivo, apresentacao, quantidade: 0, 'nomeUsuario': objetoUsuario.nome };

                }
                resultado[chaveMedicamentoGeral].quantidade += quantidade || 0;
            }
        }
    }

    var listaResultado = [];
    for (var chave in resultado) {
        if (resultado.hasOwnProperty(chave)) {
            listaResultado.push({ [chave]: resultado[chave] });
        }
    }

    return JSON.stringify(listaResultado);
}

export const relatorioEntradaMedicamento = (inputInicial, inputFinal, opcao, filtroDoador) => {
    var sheetEstoque = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Estoque');
    var estoqueData = sheetEstoque.getDataRange().getValues();

    const { dateInicial, dateFinal } = getDataInicialEDataFinal(inputInicial, inputFinal);

    const listaEstoque = filtrarDadosEntradaEstoque(estoqueData, opcao, dateInicial, dateFinal, filtroDoador);

    const listaMedicamentoGeral = getInformacoesMedicamentoGeral();

    const listaUsuarios = getUsuarios()

    const listaCombinada = combinarDados(listaEstoque, listaMedicamentoGeral, listaUsuarios);

    return listaCombinada.length > 0 ? JSON.stringify(listaCombinada) : false;
}

export const relatorioSaidaMedicamento = (inputInicial, inputFinal, opcao, filtroPaciente) => {
    var sheetEstoque = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Estoque');
    var estoqueData = sheetEstoque.getDataRange().getValues();

    const { dateInicial, dateFinal } = getDataInicialEDataFinal(inputInicial, inputFinal);

    const listaEstoque = filtrarDadosSaidaEstoque(estoqueData, opcao, dateInicial, dateFinal, filtroPaciente);

    const listaMedicamentoGeral = getInformacoesMedicamentoGeral();

    const listaUsuarios = getUsuarios()

    const listaCombinada = combinarDados(listaEstoque, listaMedicamentoGeral, listaUsuarios);

    return listaCombinada.length > 0 ? JSON.stringify(listaCombinada) : false;
}