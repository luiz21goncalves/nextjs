import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { Title } from '../styles/pages/Home';

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDom.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const { results } = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: results,
    }
  }
}
