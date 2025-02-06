"use client";
// Definir o tipo dos dados
interface Dado {
  UF: string; // Adicione a UF aqui
  MUNICÍPIO: string;
}

// Importar os dados
import dados from "@/data/dados.json";
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  // Garantir que 'dados' é do tipo Dado[]
  const citySet = new Set((dados as Dado[]).map(dado => dado.MUNICÍPIO));
  const cityArray = Array.from(citySet);

  // Estado para armazenar o valor do input
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar as cidades com base no termo de busca
  const removeAcentos = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  
  const filteredCities = cityArray.filter(city => 
    removeAcentos(city.toLowerCase()).includes(removeAcentos(searchTerm.toLowerCase()))
  );

  // Obter a UF da cidade clicada
  const getUF = (municipio: string): string => {
    const found = (dados as Dado[]).find(dado => dado.MUNICÍPIO === municipio);
    return found ? found.UF : '';
  };

  return (
    <main>
   

      <div>
        <form action="">
       
          <input 
            type="text" 
            id="citySearch"
            className="citySearch"
            value={searchTerm}
            placeholder="  Digite o nome da cidade"
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o valor do input
          />
        </form>
      </div>
      <ul>
        {filteredCities.map(MUNICÍPIO => {
          const estado = getUF(MUNICÍPIO); // Obtém a UF da cidade
          return (
            <li key={MUNICÍPIO}>
              <Link href={`/estados/${estado}/cidades/${MUNICÍPIO.replace(/\s/g, '_')}`} className="btnCities">
                {MUNICÍPIO}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}