import { baseApi } from "../../utils/apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        getAllNotifaction: builder.query({
            query: (params) => {
                const page = (params && typeof params === 'object' && params.page) ? params.page : (typeof params === 'number' ? params : 1);
                return {
                    url: `/notification/my?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["notification"]
        }),

        readSingleNotification: builder.mutation({
            query: (id) => ({
                url: `/notification/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["notification"]
        }),


        readNotification: builder.mutation({
            query: () => ({
                url: "/notification/read-all",
                method: "PATCH",
            }),
            invalidatesTags: ["notification"]
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["notification"]
        })
    }),
});

// Export hooks
export const {
    useGetAllNotifactionQuery,
    useReadSingleNotificationMutation,
    useReadNotificationMutation,
    useDeleteNotificationMutation
} = notificationApi;


