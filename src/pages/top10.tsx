import { GetStaticProps } from "next";

interface IProduct {
  id: number;
  title: string;
}

interface Top10Props {
  products: IProduct[];
}

export default function top10({ products }: Top10Props) {
  return (
    <ul>
      {products.map(product => {
        return (
          <li key={product.id}>
            {product.title}
          </li>
        );
      })}
    </ul>
  )
}

export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: {
      products,
    }
  }
}
