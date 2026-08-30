import { baseApi } from "../../utils/apiBaseQuery";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Forgot Password / Send OTP mutation
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: {
          email: data.email,
          isResetPassword: data.isResetPassword ?? true,
        },
      }),
    }),

    // Verify OTP mutation
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: {
          email,
          otp: Number(otp),
        },
      }),
    }),

    // Reset Password mutation (requires Bearer token header)
    resetPassword: builder.mutation({
      query: ({ newPassword, confirmPassword, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          newPassword,
          confirmPassword,
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;

export const useForgotEmailMutation = useForgotPasswordMutation;
export const useForgotEmailOTPCheckMutation = useVerifyOtpMutation;


