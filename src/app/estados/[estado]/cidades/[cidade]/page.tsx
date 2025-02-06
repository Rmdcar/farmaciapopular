"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import Link from 'next/link';

interface Dado {
  UF: string;
  MUNICÍPIO: string;
  CNPJ: string;
  FARMÁCIA: string;
  ENDEREÇO: string;
  BAIRRO: string;
  "Data do Credenciamento": string;
}

export default function Page() {
  const params = useParams();
  const estado = params?.estado;
  const cidade = params?.cidade;
  const cityFixed = typeof cidade === 'string' ? cidade.replace(/_/g, ' ') : '';

  // Verifique se os parâmetros estão definidos e são strings
  if (!estado || typeof estado !== 'string') {
    return <p>Estado não fornecido ou inválido</p>;
  }
  if (!cidade || typeof cidade !== 'string') {
    return <p>Cidade não fornecida ou inválida</p>;
  }

  // Filtrar os dados com base no estado e cidade fornecidos
  const neighborhoods = (dados as Dado[]).filter(dado => dado.UF === estado && dado.MUNICÍPIO === cityFixed);

  // Remover duplicações de bairros usando um Set
  const uniqueNeighborhoods = [...new Set(neighborhoods.map(bairro => bairro.BAIRRO))];

  return (
    <main>
      <h1>Bairros de {cityFixed}, {estado}</h1>
      <ul>
        {uniqueNeighborhoods.map((bairro) => (
          <li key={bairro}>
            <Link href={`/estados/${estado}/cidades/${cidade}/bairros/${bairro.replace(/\s/g, '_')}`} className="btnCities" title={`Ver farmácias no bairro ${bairro}`}>
              {bairro}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}