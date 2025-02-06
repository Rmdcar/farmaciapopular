// Definir o tipo dos dados
interface Dado {
  UF: string;
}

// Importar os dados
import dados from "@/data/dados.json";
import Link from 'next/link';

export default function Page() {
  // Garantir que 'dados' é do tipo Dado[]
  const stateSet = new Set((dados as Dado[]).map(dado => dado.UF));
  const stateArray = Array.from(stateSet);

  return (
    <main>
   <div className="divStates">
      <ul>
        {stateArray.map(UF => (
          <li key={UF}>
            <Link href={`/estados/${UF}`} className='btnStates'>
              {UF}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
