export default class ErroMedicamentoGeralExistente extends Error {
    constructor(mensagem) {
      super(mensagem);
      this.name = "MedicamentoGeralExistente";
    }
  }