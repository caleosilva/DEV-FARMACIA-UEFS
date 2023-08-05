import idSheet from './env';

export const validarCredenciais = (dadosLogin) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Usuario");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == dadosLogin.cpf && data[i][5] == dadosLogin.hashSenha) {
                const dadosUsuario = {
                    chaveUsuario: data[i][0],
                    nome: data[i][1],
                    matricula: data[i][2],
                    cpf: data[i][3],
                    email: data[i][4],
                    tipoUsuario: data[i][6]
                }
                return JSON.stringify(dadosUsuario);
            }
        }
        return false;
    }
    return null;
}

export const alterarSenha = (dados) => {
    var ss = SpreadsheetApp.openById(idSheet);
    var ws = ss.getSheetByName("Usuario");

    var lr = ws.getLastRow();

    if (lr > 1) {
        var data = ws.getRange(2, 1, lr - 1, ws.getLastColumn()).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == dados.cpf && data[i][5] == dados.hashSenha) {
                ws.getRange("F" + (i + 2)).setValue(dados.hashNovaSenha);
                return true;
            }
        }
        return false;
    }
    return null;
}