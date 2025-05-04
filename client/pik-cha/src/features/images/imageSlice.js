import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImage, transformImage } from '../../services/imageService';

const initialState = {
  images: [],
  loading: false,
  error: null,
};

// Async thunk for uploading image
export const uploadImageAsync = createAsyncThunk(
  'images/uploadImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadImage(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for transforming image
export const transformImageAsync = createAsyncThunk(
  'images/transformImage',
  async ({ imageId, transformations }, { rejectWithValue }) => {
    try {
      const response = await transformImage(imageId, transformations);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    fetchImagesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchImagesSuccess(state, action) {
      state.loading = false;
      state.images = action.payload;
      state.error = null;
    },
    fetchImagesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addImage(state, action) {
      state.images.push(action.payload);
    },
    clearImages(state) {
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload);
      })
      .addCase(uploadImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(transformImageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transformImageAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update the transformed image in the images array
        const index = state.images.findIndex(img => img.id === action.payload.id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
      })
      .addCase(transformImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { fetchImagesStart, fetchImagesSuccess, fetchImagesFailure, addImage, clearImages } = imageSlice.actions;

export default imageSlice.reducer;
