import { baseApi } from "../../utils/apiBaseQuery";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMyProfile: builder.query({
            query: () => ({
                url: "/user/my-profile",
                method: "GET",
            }),
            providesTags: ["profile"]
        }),

        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: "/user/my-profile",
                method: "PATCH",
                body: data,
            }),
            invalidTags: ["profile"]
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
            invalidTags: ["profile"]
        }),
    }),
});

// Export hooks
export const {
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
    useChangePasswordMutation,
} = profileApi;


