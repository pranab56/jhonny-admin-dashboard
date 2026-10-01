import { baseApi } from "../../utils/apiBaseQuery";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPayment: builder.query({
            query: ({ page = 1, status, searchTerm } = {}) => {
                const params = new URLSearchParams({
                    page: String(page),
                });
                if (status && status !== "all" && status !== "status") {
                    params.append("status", status);
                }
                if (searchTerm && searchTerm.trim()) {
                    params.append("searchTerm", searchTerm.trim());
                }
                return {
                    url: `/earnings/?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["payment"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllPaymentQuery,
} = paymentApi;
