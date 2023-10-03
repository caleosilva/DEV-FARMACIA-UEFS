import React from "react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import { useState, useEffect } from "react";

export default function EstoquePDF({ dados, opcRelatorio, dadosFiltros, dataUriImg }: { dados: any, opcRelatorio: string, dadosFiltros: any, dataUriImg: string }) {

    function gerarNomeArquivo(frase) {
        const dataAtual = new Date();
        const dia = dataAtual.getDate();
        const mes = dataAtual.getMonth() + 1;
        const ano = dataAtual.getFullYear();

        const diaFormatado = dia < 10 ? `0${dia}` : dia.toString();
        const mesFormatado = mes < 10 ? `0${mes}` : mes.toString();
        const dataFormatada = `${diaFormatado}-${mesFormatado}-${ano}`;

        const nomeArquivo = `FS-${frase.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '')}-${dataFormatada}`;
        return nomeArquivo;
    }

    const fileName = gerarNomeArquivo(opcRelatorio);
    const imgUrl = 'https://drive.google.com/uc?id=16w37OmWjBmHXN8aWdYud1wQYAJt__jnP';
    const imgUrlNew = 'img/logoFarmaciaPNG.png';
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: opcRelatorio,
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45],
            alignment: 'center'
        }
    ];

    function informacoesAdicionais() {
        if (opcRelatorio == "Saldo de estoque") {
            return [
                { text: `Gerado em ${formatarDataParaVisualizacao(new Date())}\n\n\n`, fontSize: 9 }
            ]
        } else if (opcRelatorio == "Entrada de medicamentos" || opcRelatorio == "Saída de medicamentos") {
            if (dadosFiltros.opcFiltro !== 'Doação' && dadosFiltros.opcFiltro !== 'Paciente') {
                return [
                    { text: `Gerado em ${formatarDataParaVisualizacao(new Date())}`, fontSize: 9 },
                    { text: `Tipo: ${dadosFiltros.opcFiltro}`, fontSize: 9 },
                    { text: `Data inicial: ${formatarDataParaVisualizacao(dadosFiltros.dataInicial)}`, fontSize: 9 },
                    { text: `Data final: ${formatarDataParaVisualizacao(dadosFiltros.dataFinal)}\n\n\n`, fontSize: 9 }
                ]
            } else {
                if (dadosFiltros.opcFiltro === 'Doação') {
                    return [
                        { text: `Gerado em ${formatarDataParaVisualizacao(new Date())}`, fontSize: 9 },
                        { text: `Tipo: ${dadosFiltros.opcFiltro}`, fontSize: 9 },
                        { text: `Doador: ${dadosFiltros.objDoador.label}`, fontSize: 9 },
                        { text: `Data inicial: ${formatarDataParaVisualizacao(dadosFiltros.dataInicial)}`, fontSize: 9 },
                        { text: `Data final: ${formatarDataParaVisualizacao(dadosFiltros.dataFinal)}\n\n\n`, fontSize: 9 }
                    ]
                } else {
                    return [
                        { text: `Gerado em ${formatarDataParaVisualizacao(new Date())}`, fontSize: 9 },
                        { text: `Tipo: ${dadosFiltros.opcFiltro}`, fontSize: 9 },
                        { text: `Paciente: ${dadosFiltros.objPaciente.label}`, fontSize: 9 },
                        { text: `Data inicial: ${formatarDataParaVisualizacao(dadosFiltros.dataInicial)}`, fontSize: 9 },
                        { text: `Data final: ${formatarDataParaVisualizacao(dadosFiltros.dataFinal)}\n\n\n`, fontSize: 9 }
                    ]
                }
            }
        }
    }

    function dadosRelatorio() {
        if (opcRelatorio == 'Saldo de estoque') {
            const dadosRelatorio = dados.map((remedio) => {
                const chave = Object.keys(remedio)[0];
                const { apresentacao, nome, principioAtivo, quantidade, nomeUsuario } = remedio[chave];
                return [
                    { text: nome, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: principioAtivo, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: apresentacao, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: quantidade, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: nomeUsuario, fontSize: 9, margin: [0, 2, 0, 2] }

                ];
            });

            return dadosRelatorio;

        } else if (opcRelatorio == 'Entrada de medicamentos') {
            const dadosRelatorio = dados.map((remedio) => {
                const { dataOperacao, nome, principioAtivo, apresentacao, novaQuantidade, quantidadeAnterior, chaveUsuario, nomeUsuario } = remedio;
                const quantidadeCalculada = parseInt(novaQuantidade) - parseInt(quantidadeAnterior);
                return [
                    { text: formatarDataParaVisualizacao(dataOperacao), fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: nome, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: principioAtivo, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: apresentacao, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: quantidadeCalculada, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: nomeUsuario, fontSize: 9, margin: [0, 2, 0, 2] }

                ]
            });

            return dadosRelatorio;

        } else if (opcRelatorio == 'Saída de medicamentos') {
            const dadosRelatorio = dados.map((remedio) => {
                const { dataOperacao, nome, principioAtivo, apresentacao, novaQuantidade, quantidadeAnterior, chaveUsuario, nomeUsuario } = remedio;
                const quantidadeCalculada = parseInt(quantidadeAnterior) - parseInt(novaQuantidade);

                return [
                    { text: formatarDataParaVisualizacao(dataOperacao), fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: nome, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: principioAtivo, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: apresentacao, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: quantidadeCalculada, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: nomeUsuario, fontSize: 9, margin: [0, 2, 0, 2] }
                ]
            });

            return dadosRelatorio;
        }
    }

    function bodyContent() {
        if (opcRelatorio == 'Saldo de estoque') {
            return [
                { text: 'Medicamento', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Princípio Ativo', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Apresentação', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Quantidade', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Usuário', style: 'tableHeader', fontSize: 11, bold: true }
            ]
        } else if (opcRelatorio == 'Entrada de medicamentos') {
            return [
                { text: 'Data de entrada', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Medicamento', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Princípio Ativo', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Apresentação', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Quantidade', style: 'tableHeader', fontSize: 11, bold: true },
                { text: 'Usuário', style: 'tableHeader', fontSize: 11, bold: true }
            ]
        } else if (opcRelatorio == 'Saída de medicamentos') {
            return [
                { text: 'Data de saída', style: 'tableHeader', fontSize: 11 },
                { text: 'Medicamento', style: 'tableHeader', fontSize: 11 },
                { text: 'Princípio Ativo', style: 'tableHeader', fontSize: 11 },
                { text: 'Apresentação', style: 'tableHeader', fontSize: 11 },
                { text: 'Quantidade', style: 'tableHeader', fontSize: 11 },
                { text: 'Usuário', style: 'tableHeader', fontSize: 11, bold: true }
            ]
        }
    }

    function widthsContent() {
        if (opcRelatorio == 'Saldo de estoque') {
            return ['*', 'auto', 80, 70, '*']
        } else if (opcRelatorio == 'Entrada de medicamentos' || opcRelatorio == 'Saída de medicamentos') {
            return ['*', '*', '*', '*', '*', '*']
        }
    }

    const details = [
        {
            table: {
                headerRows: 1,
                widths: widthsContent(),
                body: [
                    bodyContent(),
                    ...dadosRelatorio()
                ]
            },
            layout: 'lightHorizontalLines'
        }
    ];

    const renderImagem = [
        {
            image: dataUriImg,
            width: 40,
            alignment: 'center'
        }

    ]

    function Rodape(currentPage, pageCount) {
        return [
            {
                text: "Software Farmácia Solidária da UEFS \t\t\t" + currentPage + '/' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0]
            }
        ]
    }

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        info: {
            title: fileName,
            author: 'Farmacia Solidaria UEFS'
        },

        header: [reportTitle],
        content: [informacoesAdicionais(), details],
        footer: Rodape,
    }

    return (
        <>
            {pdfMake.createPdf(docDefinitions).open()}
        </>
    )
}