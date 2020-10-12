import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface CategoryProps {
  products: Document[];
  category: Document;
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <p>Carregando ...</p>
    )
  }

  return (
    <section>
      <h1>
        {PrismicDom.RichText.asText(category.data.title)}
      </h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {PrismicDom.RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const { results } = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ]);

  return {
    props: {
      category,
      products: results,
    },
    revalidate: 60,
  }
};
