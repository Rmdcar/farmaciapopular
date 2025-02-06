// /app/estados/[estado]/page.tsx
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
  const estado = params.estado;

  // Verifique se o parâmetro 'estado' está definido e é uma string
  if (!estado || typeof estado !== 'string') return <p>Parâmetro de estado não fornecido</p>;

  // Filtrar os dados com base no estado fornecido em 'params.estado' e remover duplicações de cidades
  const uniqueCities = Array.from(new Set((dados as Dado[])
    .filter(dado => dado.UF === estado)
    .map(dado => dado.MUNICÍPIO)));

  return (
    <main>
      <h1>Municípios de {estado}</h1>
      <ul>
        {uniqueCities.map((city) => (
          <li key={city}>
            <Link href={`/estados/${estado}/cidades/${city.replace(/\s/g, '_')}`} className="btnCities">
              {city}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
