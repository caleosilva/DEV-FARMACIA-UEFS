export default class MedicamentoEspecifico {
    chaveMedicamentoGeral: string;
    chaveMedicamentoEspecifico: string;
    lote: string;
    dosagem: string;
    validade: Date;
    quantidade: number;
    origem: string;
    tipo: string;
    fabricante: string;
    motivoDoacao: string;
    dataEntrada: Date;
    chaveGeral: string;

    constructor(chaveMedicamentoGeral: string, chaveMedicamentoEspecifico: string, lote: string, dosagem: string, validade: Date, quantidade: number, origem: string, tipo: string, fabricante: string, motivoDoacao: string, dataEntrada: Date, chaveGeral: string) {
        
        this.chaveMedicamentoGeral = chaveMedicamentoGeral;
        this.chaveMedicamentoEspecifico = chaveMedicamentoEspecifico;
        this.lote = lote;
        this.dosagem = dosagem;
        this.validade = validade;
        this.quantidade = quantidade;
        this.origem = origem;
        this.tipo = tipo;
        this.fabricante = fabricante;
        this.motivoDoacao = motivoDoacao;
        this.dataEntrada = dataEntrada;
        this.chaveGeral = chaveGeral;
    }
}