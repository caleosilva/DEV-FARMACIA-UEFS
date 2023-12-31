// Imports padrão:
import {
  onOpen,
  openDialogBootstrap,
} from './ui';

import {
  getSheetsData,
  deleteSheet,
  setActiveSheet,
  doGet,
} from './sheets';

// Imports de funções Gerais:
import {
  getInformacoesSelect,
  buscaBinariaSimples,
  formatarData,
  atualizarChavesPrimariaMedicamentos,
  atualizarChavesPrimariaMedicamentoEspecifico,
  atualizarChavesPrimariaEstoque,
  getConfiguracoes
} from './geral'

// Imports referentes aos Medicamentos:
import {
  encontrarMedicamentoTabelaMedicamentos,
  getMedicamentos,
  appendRowMedicamentos,
  updateRowMedicamentos
} from './medicamentos'

// Imports referentes ao Estoque:
import {
  queryChaveMedicamentoGeral,
  buscaBinariaCompletaPelaChaveMedicamentoGeral,
  queryMedicamentoEspecifico,
  appendRowMedicamentoEspecifico,
  atualizarQuantidadeEstoque,
  updateRowEstoque,
  removeRowEstoque,
  getMedEspecificoChaveMedGeral
} from './estoque'

// Import referente aos Doadores:
import {
  getDoadores,
  appendRowDoadores,
  removeRowDoador,
  updateRowDoador
} from './doadores'

import {
  getPacientes,
  appendRowPacientes,
  removeRowPaciente,
  updateRowPaciente,
  saidaPorPaciente
} from './pacientes';

import {
  validarCredenciais,
  alterarSenha
} from './usuarios.js';

import {
  relatorioSaldoDeEstoque,
  relatorioEntradaMedicamento,
  relatorioSaidaMedicamento
} from './relatorio.js';

// Public functions must be exported as named exports
export {
  deleteSheet, setActiveSheet, doGet, onOpen, openDialogBootstrap, getSheetsData,

  //Geral
  getInformacoesSelect,
  buscaBinariaSimples,
  formatarData,
  atualizarChavesPrimariaMedicamentos,
  atualizarChavesPrimariaMedicamentoEspecifico,
  atualizarChavesPrimariaEstoque,
  getConfiguracoes,

  //Medicamentos
  getMedicamentos,
  appendRowMedicamentos,
  updateRowMedicamentos,
  encontrarMedicamentoTabelaMedicamentos,

  //Estoque
  queryChaveMedicamentoGeral,
  buscaBinariaCompletaPelaChaveMedicamentoGeral,
  queryMedicamentoEspecifico,
  appendRowMedicamentoEspecifico,
  atualizarQuantidadeEstoque,
  updateRowEstoque,
  removeRowEstoque,
  getMedEspecificoChaveMedGeral,

  //Doadores
  getDoadores,
  appendRowDoadores,
  removeRowDoador,
  updateRowDoador,

  //Pacintes
  getPacientes,
  appendRowPacientes,
  removeRowPaciente,
  updateRowPaciente,
  saidaPorPaciente,

  //Usuarios
  validarCredenciais,
  alterarSenha,

  // Relatorio
  relatorioSaldoDeEstoque,
  relatorioEntradaMedicamento,
  relatorioSaidaMedicamento
};
