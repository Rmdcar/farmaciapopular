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

export default function BairroPage() {
  const params = useParams();
  const estado = params?.estado;
  let cidade = params?.cidade;
  let bairro = params?.bairro;

  if (typeof cidade === 'string') {
    cidade = cidade.replace(/_/g, ' ');
  }

  if (typeof bairro === 'string') {
    bairro = bairro.split('_').join(' ');
  }

  // Verifique se os parâmetros 'estado', 'cidade' e 'bairro' estão definidos e são strings
  if (!estado || typeof estado !== 'string' ||
      !cidade || typeof cidade !== 'string' ||
      !bairro || typeof bairro !== 'string') {
    return <p>Parâmetros de estado, cidade ou bairro não fornecidos</p>;
  }

  // Filtrar os dados com base no estado, cidade e bairro fornecidos
  const filteredData = (dados as Dado[]).filter(dado => dado.UF === estado && dado.MUNICÍPIO === cidade && dado.BAIRRO === bairro);

  // Remover duplicações de farmácias usando um Set
  let uniquePharmacies = Array.from(new Set(filteredData.map(data => data.FARMÁCIA)));

  return (
    <main>
      <h1>{bairro}, {cidade}, {estado}</h1>
      
      <ul>
        {uniquePharmacies.map((farmacia, index) => (
          <li key={index}>
            <Link 
              href={`/estados/${encodeURIComponent(estado)}/cidades/${(params.cidade ?? '')}/bairros/${encodeURIComponent(bairro ?? '')}/farmacias/${encodeURIComponent(farmacia.replace(/\s/g, '_'))}`} 
              className="btnNeigborhoods"
            >
              <p><strong>Farmácia:</strong> {farmacia}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
