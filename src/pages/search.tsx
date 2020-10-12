import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Document } from "prismic-javascript/types/documents";
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { FormEvent, useState } from "react"
import { client } from "@/lib/prismic";
import Link from 'next/link';

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router =  useRouter();
  const [search, setSearch] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        <button type="submit">Buscars</button>
      </form>

      <ul>
        {searchResults.map(product => {
          return (
            <li key={product.id}>
              <Link href={`catalog/products/${product.uid}`}>
                <a>
                  {PrismicDom.RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query;

  if(!q) {
    return { props: { searchResults: [] } };
  }

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ]);

  return {
    props: {
      searchResults: searchResults.results,
    }
  };
}
