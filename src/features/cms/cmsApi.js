import { baseApi } from "../../utils/apiBaseQuery";

export const cmsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: "/cms/privacy-policy",
                method: "GET",
            }),
            providesTags: ["cms"],
        }),

        updatePrivacyPolicy: builder.mutation({
            query: (data) => ({
                url: "/cms/privacy-policy",
                method: "PUT",
                body: data,
            }),
            invalidTags: ["cms"],
        }),

        getTermsAndCondition: builder.query({
            query: () => ({
                url: "/cms/terms-of-service",
                method: "GET",
            }),
            providesTags: ["cms"],
        }),

        updateTermsAndCondition: builder.mutation({
            query: (data) => ({
                url: "/cms/terms-of-service",
                method: "PUT",
                body: data,
            }),
            invalidTags: ["cms"],
        }),
    }),
});

// Export hooks
export const {
    useGetPrivacyPolicyQuery,
    useUpdatePrivacyPolicyMutation,
    useGetTermsAndConditionQuery,
    useUpdateTermsAndConditionMutation,
} = cmsApi;
