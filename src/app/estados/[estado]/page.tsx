"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import Link from 'next/link';
import { useState } from 'react';

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
  const estado = params.estado;

  const [searchTerm, setSearchTerm] = useState('');

  // Função para remover acentos
  const removeAcentos = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Verifique se o parâmetro 'estado' está definido e é uma string
  if (!estado || typeof estado !== 'string') return <p>Parâmetro de estado não fornecido</p>;

  // Filtrar os dados com base no estado fornecido em 'params.estado' e remover duplicações de cidades
  const uniqueCities = Array.from(new Set((dados as Dado[])
    .filter(dado => dado.UF === estado)
    .map(dado => dado.MUNICÍPIO)));

  // Filtrar as cidades com base no termo de busca
  const filteredCities = uniqueCities.filter(city => 
    removeAcentos(city.toLowerCase()).includes(removeAcentos(searchTerm.toLowerCase()))
  );

  return (
    <main>
      <div>
        <form>
          <input 
            type="text" 
            id="citySearch"
            className="citySearch"
            value={searchTerm}
            placeholder="Digite o nome da cidade"
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o valor do input
          />
        </form>
      </div>

      <h1>Municípios de {estado}</h1>
      <ul>
        {filteredCities.map((city) => (
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