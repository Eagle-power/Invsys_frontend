import { apiSlice } from '../api/apiSlice';

export const geminiApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateDescription: builder.mutation({
            query: ({ productName, category }) => ({
                url: '/api/gemini/generate-description',
                method: 'POST',
                body: { productName, category },
            }),
        }),
        generateCategoryDescription: builder.mutation({
            query: ({ categoryName }) => ({
                url: '/api/gemini/generate-category-description',
                method: 'POST',
                body: { categoryName },
            }),
        }),
    }),
});

export const { useGenerateDescriptionMutation, useGenerateCategoryDescriptionMutation } = geminiApiSlice;
