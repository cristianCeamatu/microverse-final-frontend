import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Actions
import { deleteProduct } from './catalogSlice';

const Product = ({ product }) => {
  // State
  const currentUser = useSelector((state) => state.user.user);
  const headers = useSelector((state) => state.user.headers);
  const loading = useSelector((state) => state.catalog.loaders.deleteProduct);
  const error = useSelector((state) => state.catalog.errors.deleteProduct);
  const { id, name, description, price, usedFor, ratings, user } = product;

  // Effects
  const dispatch = useDispatch();
  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteProduct({ id, headers }));
  };

  return (
    <div>
      {error ? <p>{error}</p> : null}
      {currentUser.id === user.id ? (
        <div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading && loading === id}
          >
            X
          </button>
          <button type="button">Edit</button>
        </div>
      ) : null}
      <ul>
        <li>{name}</li>
        <li>{description}</li>
        <li>{price}</li>
        <li>{usedFor}</li>
        {ratings ? <li>{ratings.join('-')}</li> : null}
        <li>By {user.name}</li>
        <li>
          <Link to={`/products/${id}`}>More details</Link>
        </li>
      </ul>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Product;
