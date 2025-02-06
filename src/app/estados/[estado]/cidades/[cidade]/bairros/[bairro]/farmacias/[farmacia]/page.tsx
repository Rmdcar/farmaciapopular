"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import { useState } from 'react';

interface Dado {
  UF: string;
  "CÓD. MUNICÍPIO": string;
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

  // Verifique se os parâmetros 'estado', 'cidade' e 'farmacia' estão definidos e são strings
  if (!estado || typeof estado !== 'string' ||
      !cidade || typeof cidade !== 'string' ||
      !farmacia || typeof farmacia !== 'string') {
    return <p>Parâmetros de estado, cidade ou farmácia não fornecidos</p>;
  }

  // Filtrar os dados com base no estado, cidade e farmácia fornecidos
  const filteredData = (dados as Dado[]).filter(dado => dado.UF === estado && dado.MUNICÍPIO === cidade && dado.FARMÁCIA === farmacia && dado.BAIRRO === bairro);


  const [selectedData, setSelectedData] = useState<Dado | null>(null);

  // Função para lidar com o clique em um item
  const handleItemClick = (data: Dado) => {
    setSelectedData(data);
  };

  return (
    <main>
      <h1>{farmacia}</h1>
      <ul>
        {filteredData.map((data, index) => {
          const urlReceita = `https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp?cnpj=${data.CNPJ}`;
          const enderecoCompleto = `${data.ENDEREÇO}, ${data.BAIRRO}, ${cidade}, ${estado}, ${farmacia}`;
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

          return (
            <li key={index} className="btnPharmacies" onClick={() => handleItemClick(data)}>
              <p>
                <strong>CNPJ:</strong> 
                <a href={urlReceita} target="_blank" rel="noopener noreferrer"> {data.CNPJ} &#x1F50D;</a>
              </p>
              <p><strong>Endereço:</strong> {data.ENDEREÇO}</p>
              <p><strong>Bairro:</strong> {data.BAIRRO}</p>
              <p><strong>Data do Credenciamento:</strong> {data["Data do Credenciamento"]}</p>
              <p></p>
              <div>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
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