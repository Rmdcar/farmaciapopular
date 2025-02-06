"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import { useState } from 'react';

interface Dado {
  Id: string; // Adicionado
  UF: string;
  MUNICÍPIO: string;
  CNPJ: string;
  FARMÁCIA: string;
  ENDEREÇO: string;
  BAIRRO: string;
  "Data do Credenciamento": string;
}

export default function FarmaciaPage() {
  const params = useParams();
  const estado = params?.estado;
  const cidade = typeof params?.cidade === 'string' ? params.cidade.replace(/_/g, ' ') : '';
  const bairro = typeof params?.bairro === 'string' ? decodeURIComponent(params.bairro.replace(/_/g, ' ')) : '';
  const farmacia = typeof params?.farmacia === 'string' ? decodeURIComponent(params.farmacia.replace(/_/g, ' ')) : '';

  // Verifique se os parâmetros estão definidos e são strings
  if (!estado || typeof estado !== 'string') {
    return <p>Estado não fornecido ou inválido</p>;
  }
  if (!cidade || typeof cidade !== 'string') {
    return <p>Cidade não fornecida ou inválida</p>;
  }
  if (!farmacia || typeof farmacia !== 'string') {
    return <p>Farmácia não fornecida ou inválida</p>;
  }

  // Verifique se os dados foram carregados corretamente
  if (!Array.isArray(dados)) {
    return <p>Erro ao carregar os dados</p>;
  }

  // Filtrar os dados com base no estado, cidade, farmácia e bairro (se fornecido)
  const filteredData = (dados as Dado[]).filter(dado => 
    dado.UF === estado && 
    dado.MUNICÍPIO === cidade && 
    dado.BAIRRO === bairro
  );

  if (filteredData.length === 0) {
    return <p>Nenhuma farmácia encontrada para os critérios fornecidos</p>;
  }

  return (
    <main>
      <h1>{farmacia}</h1>
      <ul>
        {filteredData.map((data) => {
          const urlReceita = `https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp?cnpj=${data.CNPJ}`;
          const enderecoCompleto = `${data.ENDEREÇO}, ${data.BAIRRO}, ${cidade}, ${estado}, ${farmacia}`;
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

          return (
            <li key={data.Id} className="btnPharmacies">
              <p>
                <strong>CNPJ:</strong> 
                <a href={urlReceita} target="_blank" rel="noopener noreferrer" title="Ver CNPJ na Receita Federal">
                  {data.CNPJ} &#x1F50D;
                </a>
              </p>
              <p><strong>Endereço:</strong> {data.ENDEREÇO}</p>
              <p><strong>Bairro:</strong> {data.BAIRRO}</p>
              <p><strong>Data do Credenciamento:</strong> {data["Data do Credenciamento"]}</p>
              <div>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" title="Ver no Google Maps">
                  Ver no Google Maps &#x2934;&#xFE0F;
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}