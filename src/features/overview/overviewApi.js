import { baseApi } from "../../utils/apiBaseQuery";

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login mutation
        getAllState: builder.query({
            query: () => ({
                url: "/admin/stats",
                method: "GET",
            }),
        }),

        revenueChart: builder.query({
            query: () => ({
                url: "/admin/revenue-chart",
                method: "GET",
            }),
        }),
    }),
});

// Export hooks
export const {
    useGetAllStateQuery,
    useRevenueChartQuery,
} = overviewApi;


