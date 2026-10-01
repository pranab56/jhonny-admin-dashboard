import { baseApi } from "../../utils/apiBaseQuery";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // service seeker list
        getAllServiceSeeker: builder.query({
            query: ({ page = 1, status, searchTerm } = {}) => {
                const params = new URLSearchParams({
                    role: "CLIENT",
                    page: String(page),
                });
                if (status && status !== "all" && status !== "status") {
                    params.append("status", status);
                }
                if (searchTerm && searchTerm.trim()) {
                    params.append("searchTerm", searchTerm.trim());
                }
                return {
                    url: `/user/users?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["user"]
        }),

        // get single service seeker details
        getSingleServiceSeeker: builder.query({
            query: (id) => ({
                url: `/user/users/${id}`,
                method: "GET",
            }),
            providesTags: ["user"]
        }),

        // block and unblock user
        blockAndUnblockUser: builder.mutation({
            query: ({ id, isBlocked, status }) => ({
                url: `/user/users/${id}/block`,
                method: "PATCH",
                body: { isBlocked: isBlocked ?? status } // true or false
            }),
            invalidTags: ["user"]
        }),

        // update status
        updateStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/user/users/${id}/status`,
                method: "PATCH",
                body: { status }  // "active" or "inactive"
            }),
            invalidTags: ["user"]
        }),

        // ------------------------------------------------

        // caregiver list
        getAllCareGivers: builder.query({
            query: ({ page = 1, searchTerm } = {}) => {
                const params = new URLSearchParams({
                    page: String(page),
                });
                if (searchTerm && searchTerm.trim()) {
                    params.append("searchTerm", searchTerm.trim());
                }
                return {
                    url: `/caregiver-profiles/admin?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["user"]
        }),

        verifyCaregiver: builder.mutation({
            query: ({ id, status, data }) => ({
                url: `/caregiver-profiles/${id}/verify`,
                method: "PATCH",
                body: data || { status }
            }),
            invalidTags: ["user"]
        }),

        toggleVerifyCaregiver: builder.mutation({
            query: ({ id, data }) => ({
                url: `/caregiver-profiles/${id}/badge`,
                method: "PATCH",
                body: data || {}
            }),
            invalidTags: ["user"]
        }),

        inviteCaregiver: builder.mutation({
            query: (data) => ({
                url: `/admin/invite-caregiver`,
                method: "POST",
                body: data
            }),
            invalidTags: ["user"]
        }),

    }),
});

// Export hooks
export const {
    useGetAllServiceSeekerQuery,
    useGetSingleServiceSeekerQuery,
    useBlockAndUnblockUserMutation,
    useUpdateStatusMutation,
    useGetAllCareGiversQuery,
    useVerifyCaregiverMutation,
    useToggleVerifyCaregiverMutation,
    useInviteCaregiverMutation
} = userApi;
