"use client";

import { useParams } from 'next/navigation';
import dados from '@/data/dados.json';
import { useState, useEffect } from 'react';
import axios from 'axios';


interface Dado {
  Id: string;
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

export default function FarmaciaPage() {
  const params = useParams();
  const estado = params?.estado;
  const cidade = typeof params?.cidade === 'string' ? params.cidade.replace(/_/g, ' ') : '';
  const bairro = typeof params?.bairro === 'string' ? decodeURIComponent(params.bairro.replace(/_/g, ' ')) : '';
  const farmacia = typeof params?.farmacia === 'string' ? decodeURIComponent(params.farmacia.replace(/_/g, ' ')) : '';

  


  const [receitaData, setReceitaData] = useState<ReceitaData[]>([]);

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
    dado.BAIRRO === bairro &&
    dado.FARMÁCIA === farmacia
  );
  const cnpjs = filteredData.map(dado => dado.CNPJ);

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  // Função para formatar telefone
  const formatarTelefone = (telefone: string) => {
    if (telefone.length === 10) {
      return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (telefone.length === 11) {
      return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    return telefone; // Retorna o telefone sem formatação se não for válido
  };

  // Função para buscar os dados da API Minha Receita
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
      const results = await Promise.all(cnpjs.map(cnpj => fetchReceitaData(cnpj)));
      setReceitaData(results.filter(data => data !== null)); // Filtra resultados nulos
    };

    fetchAllData();
  }, [cnpjs]);

  if (filteredData.length === 0) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>{receitaData[0]?.nome_fantasia || farmacia}</h1>
      <ul>
        {receitaData.map((data, index) => {
          const urlReceita = `https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp?cnpj=${data.cnpj}`;
          const enderecoCompleto = `${data.descricao_tipo_de_logradouro}, ${data.logradouro}, ${data.numero}, ${data.bairro}, ${cidade}, ${estado}, ${data.nome_fantasia}`;
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

          return (
            <li key={index} className="btnPharmacies">
              <p>
                <strong>CNPJ:</strong> 
                <a href={urlReceita} target="_blank" rel="noopener noreferrer" title="Ver CNPJ na Receita Federal">
                  {formatarCNPJ(data.cnpj)} &#x1F50D;
                </a>
              </p>
              <p><strong>Endereço:</strong> {data.descricao_tipo_de_logradouro} {data.logradouro}, {data.numero} {data.complemento}</p>
              <p><strong>Bairro:</strong> {data.bairro}</p>
              <p><strong>Telefone:</strong> {formatarTelefone(data.ddd_telefone_1)}</p>
              <div>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" title="Ver no Google Maps">
                  <br />
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