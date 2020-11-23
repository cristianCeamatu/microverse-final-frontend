import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import Loading from '../Loading';
import Error from '../Error';
import Product from './Product';
// Actions
import { getProducts } from '../../features/catalog/catalogSlice';
// Styles
import { ProductsContainer, SliderPaginationContainer } from './Styles.styled';

const AllProducts = () => {
  // State
  const loading = useSelector((state) => state.catalog.loaders.loadingProducts);
  const error = useSelector((state) => state.catalog.errors.loadingProducts);
  const products = useSelector((state) => state.catalog.products);

  // Effects
  const dispatch = useDispatch();
  useEffect(() => {
    if (products.length === 0) dispatch(getProducts());
  }, [dispatch, products]);

  // Utils
  const productsItems = [...products].map((product) => (
    <Product key={product.id} product={product} />
  ));

  return (
    <ProductsContainer>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error errors={error} />
      ) : (
        <div className="slider">{productsItems}</div>
      )}

      <SliderPaginationContainer>
        Total: {products.length}
      </SliderPaginationContainer>
    </ProductsContainer>
  );
};

export default AllProducts;