import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const base_uri = 'https://handmades-rails-api-backend.herokuapp.com/items';

export const getProducts = createAsyncThunk('catalog/getProducts', async () => {
  const response = await axios.get(base_uri);
  return response.data;
});

export const getProduct = createAsyncThunk('catalog/getProduct', async (id) => {
  const response = await axios.get(`${base_uri}/${id}`);
  return response.data;
});

export const addProduct = createAsyncThunk(
  'catalog/addProduct',
  async ({ data, headers }, { rejectWithValue }) => {
    try {
      const response = await axios.post(base_uri, data, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'catalog/deleteProduct',
  async ({ id, headers }) => {
    const response = await axios.delete(`${base_uri}/${id}`, { headers });
    return response.data;
  }
);

export const favorite = createAsyncThunk(
  'catalog/favorite',
  async ({ id, type, currentUser, headers }) => {
    await axios.put(`${base_uri}/${id}/favorite`, { type }, { headers });
    return { id, type, currentUser };
  }
);

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products: [],
    loaders: {},
    errors: {},
    filters: {},
    product: { user: {}, favorited_by: [] },
  },
  reducers: {
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: {
    [getProducts.pending]: (state) => {
      state.loaders.loadingProducts = true;
      state.errors.loadingProducts = false;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.products = action.payload.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      state.loaders.loadingProducts = false;
      state.errors.loadingProducts = false;
    },
    [getProducts.rejected]: (state, action) => {
      state.errors.loadingProducts = action.error.message;
      state.loaders.loadingProducts = false;
    },
    [getProduct.pending]: (state) => {
      state.loaders.loadingProduct = true;
      state.errors.loadingProduct = false;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.product = action.payload;
      state.loaders.loadingProduct = false;
      state.errors.loadingProduct = false;
    },
    [getProduct.rejected]: (state, action) => {
      state.errors.loadingProduct = action.error.message;
      state.loaders.loadingProduct = false;
    },
    [addProduct.pending]: (state) => {
      state.loaders.addProduct = true;
      state.errors.addProduct = false;
    },
    [addProduct.fulfilled]: (state, action) => {
      state.products.push(action.payload);
      state.loaders.addProduct = false;
      state.errors.addProduct = false;
    },
    [addProduct.rejected]: (state, action) => {
      state.errors.addProduct = action.payload;
      state.loaders.addProduct = false;
    },
    [deleteProduct.pending]: (state, action) => {
      state.loaders.deleteProduct = action.meta.arg.id;
      state.errors.deleteProduct = false;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id
      );
      state.product = { user: {}, favorited_by: [] };
      state.loaders.deleteProduct = false;
      state.errors.deleteProduct = false;
    },
    [deleteProduct.rejected]: (state, action) => {
      state.errors.deleteProduct = action.payload;
      state.loaders.deleteProduct = false;
    },
    [favorite.pending]: (state, action) => {
      state.loaders.favorite = action.meta.arg.id;
      state.errors.favorite = false;
    },
    [favorite.fulfilled]: (state, action) => {
      const { id, type, currentUser } = action.payload;
      state.products.map((product) => {
        if (product.id === id) {
          type === 'favorite'
            ? product.favorited_by.push(currentUser)
            : (product.favorited_by = product.favorited_by.filter(
                (favorite) => favorite.id !== currentUser.id
              ));
          state.product = product;
          return product;
        }
        return product;
      });
      state.loaders.favorite = false;
      state.errors.favorite = false;
    },
    [favorite.rejected]: (state, action) => {
      state.errors.favorite = action.error.message;
      state.loaders.favorite = false;
    },
  },
});

export const { decrement, incrementByAmount } = catalogSlice.actions;

export default catalogSlice.reducer;
