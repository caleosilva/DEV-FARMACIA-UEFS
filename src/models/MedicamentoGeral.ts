export default class MedicamentoGeral {
    chaveGeral: string;
    dataCadastro: Date; // sempre no formato dd-mm-aaaa
    nome: string;
    principioAtivo: string;
    tarja: string;
    classe: string;
    apresentacao: string;
    quantidadeTotal: number;
    validadeMaisProxima: string; // sempre no formato dd-mm-aaaa ou somente -

    constructor(chaveGeral: string, dataCadastro: Date, nome: string, principioAtivo: string, tarja: string, classe: string, apresentacao: string, quantidadeTotal: number, validadeMaisProxima: string) {

        this.chaveGeral = chaveGeral;
        this.dataCadastro = dataCadastro;
        this.nome = nome;
        this.principioAtivo = principioAtivo;
        this.tarja = tarja;
        this.classe = classe;
        this.apresentacao = apresentacao;
        this.quantidadeTotal = quantidadeTotal;
        this.validadeMaisProxima = validadeMaisProxima;
    }
}