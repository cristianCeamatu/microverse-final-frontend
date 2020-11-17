import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Product from './Product';
// Actions
import { getProducts } from './catalogSlice';

const FavoritedProducts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const products = useSelector((state) => state.catalog.products);
  const productsItems = [...products]
    .sort(
      (prodA, prodB) => prodB.favorited_by.length - prodA.favorited_by.length
    )
    .slice(0, 4)
    .map((product) => <Product key={product.id} product={product} />);

  console.log('products :>> ', products);
  return (
    <div>
      <h1>Most favorited</h1>
      {productsItems}
    </div>
  );
};

export default FavoritedProducts;
