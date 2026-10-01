import { baseApi } from "../../utils/apiBaseQuery";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBooking: builder.query({
            query: ({ page = 1, limit = 10, paymentStatus = "", searchTerm = "", dateFrom = "", dateTo = "" } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (limit) params.append("limit", limit);
                if (paymentStatus && paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (dateFrom) params.append("dateFrom", dateFrom);
                if (dateTo) params.append("dateTo", dateTo);

                return {
                    url: `/booking?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["booking"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllBookingQuery,
} = bookingApi;


