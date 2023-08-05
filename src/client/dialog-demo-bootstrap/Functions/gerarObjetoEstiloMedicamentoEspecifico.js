
import formatarData from '../Functions/formatarData';

export default function gerarObjetoEstiloMedicamentoEspecifico(medicamento) {

    var novaChaveMedicamentoEspecifico = (medicamento.lote + '#' + medicamento.dosagem + '#' + formatarData(medicamento.validade)).toString().toLowerCase().replace(/\s/g, '');
    var novaChaveGeral = medicamento.chaveMedicamentoGeral + '#' + novaChaveMedicamentoEspecifico;


    const dados = {
        chaveMedicamentoGeral: medicamento.chaveMedicamentoGeral,
        chaveMedicamentoEspecifico: novaChaveMedicamentoEspecifico,
        lote: medicamento.lote,
        dosagem: medicamento.dosagem,
        validade: medicamento.validade,
        quantidade: medicamento.quantidade,
        origem: medicamento.origem,
        tipo: medicamento.tipo,
        fabricante: medicamento.fabricante,
        motivoDoacao: medicamento.motivoDoacao,
        dataEntrada: medicamento.dataEntrada,
        chaveGeral: novaChaveGeral
    }

    return dados
}