export default class Doador{
    chaveDoador: string;
    nome: string;
    tipoDoador: string;
    cidade: string;
    bairro: string;
    endereco: string;
    numero: string;
    comoSoube: string;
    cnpj: string;
    cpf: string;
    // dataNascimento: Date | string;
    dataNascimento: Date;
    sexo: string;
    estadoCivil: string;
    nomeSocial: string;
    identidadeGenero: string;

    constructor(chaveDoador: string, nome: string, tipoDoador: string, cidade: string, bairro: string, endereco: string, numero: string, comoSoube: string, cnpj: string, cpf: string, dataNascimento: Date, sexo: string, estadoCivil: string, nomeSocial: string, identidadeGenero: string){

        this.chaveDoador = chaveDoador;
        this.nome = nome;
        this.tipoDoador = tipoDoador;
        this.cidade = cidade;
        this.bairro = bairro;
        this.endereco = endereco;
        this.numero = numero;
        this.comoSoube = comoSoube;
        this.cnpj = cnpj;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.estadoCivil = estadoCivil;
        this.nomeSocial = nomeSocial;
        this.identidadeGenero = identidadeGenero;
    }

}