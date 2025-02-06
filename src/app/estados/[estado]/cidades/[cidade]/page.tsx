"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import Link from 'next/link';

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

export default function Page() {
  const params = useParams();
  const estado = params?.estado;
  const cidade = params?.cidade;
  const cityFixed = cidade?.replace(/_/g, ' ');

  // Verifique se os parâmetros 'estado' e 'cidade' estão definidos e são strings
  if (!estado || typeof estado !== 'string' || !cidade || typeof cidade !== 'string') {
    return <p>Parâmetros de estado ou cidade não fornecidos</p>;
  }

  // Filtrar os dados com base no estado e cidade fornecidos
  const neighborhoods = (dados as Dado[]).filter(dado => dado.UF === estado && dado.MUNICÍPIO === cityFixed);

  // Remover duplicações de bairros usando um Set
  const uniqueNeighborhoods = Array.from(new Set(neighborhoods.map(bairro => bairro.BAIRRO)));

  return (
    <main>
      <h1>Bairros de {cityFixed}, {estado}</h1>
      <ul>
        {uniqueNeighborhoods.map((bairro) => (
          <li key={bairro}>
            <Link href={`/estados/${estado}/cidades/${cidade}/bairros/${bairro.replace(/\s/g, '_')}`} className="btnCities">
              {bairro}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
