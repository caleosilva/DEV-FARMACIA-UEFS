export default function gerarObjetoEstiloMedicamentoGeral(medicamento) {

    const chaveGeral = (medicamento.nome + "#" + medicamento.principioAtivo + "#" + medicamento.apresentacao).toString().toLowerCase().replace(/\s+/g, '');

    const dataCadastro = medicamento.dataCadastro;
    const nome = medicamento.nome;
    const principioAtivo = medicamento.principioAtivo;
    const classe = medicamento.classe;
    const tarja = medicamento.tarja;
    const apresentacao = medicamento.apresentacao;
    const quantidadeTotal = medicamento.quantidadeTotal;
    const validadeMaisProxima = medicamento.validadeMaisProxima;

    const dados = {
        chaveGeral,
        dataCadastro,
        nome,
        principioAtivo,
        classe,
        tarja,
        apresentacao,
        quantidadeTotal,
        validadeMaisProxima
    }

    return dados
}
