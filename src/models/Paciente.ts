export default class Doador{
    chavePaciente: string;
    nome: string;
    cpf: string;
    dataNascimento: Date;
    telefone: string;
    tipoPaciente: string;
    sexo: string;
    estadoCivil: string;
    cidade: string;
    bairro: string;
    endereco: string;
    numero: string;
    comoSoube: string;
    nivelEscolaridade: string;
    profissao: string;
    nomeSocial: string;
    identidadeGenero: string;
    
    constructor(chavePaciente: string, nome: string, cpf: string, dataNascimento: Date, telefone: string, tipoPaciente: string, sexo: string, estadoCivil: string, cidade: string, bairro: string, endereco: string, numero: string, comoSoube: string, nivelEscolaridade: string, profissao: string, nomeSocial: string, identidadeGenero: string){
        this.chavePaciente = chavePaciente;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.tipoPaciente = tipoPaciente;
        this.sexo = sexo;
        this.estadoCivil = estadoCivil;
        this.cidade = cidade;
        this.bairro = bairro;
        this.endereco = endereco;
        this.numero = numero;
        this.comoSoube = comoSoube;
        this.nivelEscolaridade = nivelEscolaridade;
        this.profissao = profissao;
        this.nomeSocial = nomeSocial;
        this.identidadeGenero = identidadeGenero;
    }

}