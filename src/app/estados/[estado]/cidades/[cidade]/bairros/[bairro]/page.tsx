"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Dado {
  UF: string;
  MUNICÍPIO: string;
  CNPJ: string;
  FARMÁCIA: string;
  ENDEREÇO: string;
  BAIRRO: string;
  "Data do Credenciamento": string;
}

interface ReceitaData {
  cnpj: string;
  nome_fantasia: string;
  descricao_tipo_de_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  ddd_telefone_1: string;
}

export default function BairroPage() {
  const params = useParams();
  const estado = params?.estado;
  let cidade = params?.cidade;
  let bairro = params?.bairro;

  const [receitaData, setReceitaData] = useState<ReceitaData[]>([]);

  if (typeof cidade === 'string') {
    cidade = cidade.replace(/_/g, ' ');
  }

  if (typeof bairro === 'string') {
    bairro = bairro.split('_').join(' ');
  }

  if (!estado || typeof estado !== 'string' ||
      !cidade || typeof cidade !== 'string' ||
      !bairro || typeof bairro !== 'string') {
    return <p>Parâmetros de estado, cidade ou bairro não fornecidos</p>;
  }

  const filteredData = (dados as Dado[]).filter(dado => dado.UF === estado && dado.MUNICÍPIO === cidade && dado.BAIRRO === bairro);
  const cnpjs = filteredData.map(dado => dado.CNPJ);

  const fetchReceitaData = async (cnpj: string) => {
    try {
      const response = await axios.get(`https://minhareceita.org/${cnpj}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar dados para o CNPJ ${cnpj}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const results = await Promise.all(cnpjs.map(cnpj => fetchReceitaData(cnpj)));
        const validResults = results.filter(data => data !== null);

        const uniqueResults = Array.from(new Set(validResults.map(data => data.nome_fantasia)))
          .map(nome_fantasia => {
            return validResults.find(data => data.nome_fantasia === nome_fantasia);
          });

        setReceitaData(uniqueResults);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchAllData();
  }, [cnpjs]);

  const uniquePharmacies = Array.from(new Set(filteredData.map(data => data.FARMÁCIA)));

  return (
    <main>
      <h1>{bairro}, {cidade}, {estado}</h1>
      
      <ul>
        {receitaData.length > 0 ? (
          receitaData.map((data, index) => (
            <li key={data.cnpj || index}>
              <Link 
                href={`/estados/${encodeURIComponent(estado)}/cidades/${(params.cidade ?? '')}/bairros/${encodeURIComponent(bairro ?? '')}/farmacias/${encodeURIComponent(uniquePharmacies[index].replace(/\s/g, '_'))}`} 
                className="btnNeigborhoods"
              >
                <p><strong>Farmácia:</strong> {data.nome_fantasia}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>Carregando...</p>
        )}
      </ul>
    </main>
  );
}