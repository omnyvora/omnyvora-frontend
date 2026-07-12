export const AUTH_ROUTES = {
  login:           "/login",
  register:        "/register",
  forgotPassword:  "/forgot-password",
  resetPassword:   "/reset-password",
  dashboard:       "/dashboard",
  adminDashboard:  "/admin",
} as const;

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECS = 60;

export const OTP_PURPOSE = {
  registration:   "registration",
  passwordReset:  "password_reset",
} as const;

export const OTP_CHANNEL = {
  email: "email",
} as const;

export const STRINGS = {
  login: {
    title:    "Welcome back",
    subtitle: "Sign in to your account",
    submit:   "Sign in",
    footer:   "Don't have an account?",
    register: "Register",
    forgot:   "Forgot password?",
    google:   "Sign in with Google",
  },
  register: {
    title:    "Create your account",
    subtitle: "Fill in the details below to get started",
    submit:   "Create account",
    footer:   "Already have an account?",
    signIn:   "Sign in",
    sendOtp:  "Send OTP",
    google:   "Sign up with Google",
    otpHint:  "Sent to your email · Valid for 5 minutes",
    resend:   "Resend OTP",
  },
  resetPassword: {
    step1Title:    "Reset your password",
    step1Subtitle: "Enter your email to receive a reset code",
    step1Submit:   "Send reset code",
    step2Title:    "Enter your code",
    step2Submit:   "Verify code",
    step3Title:    "Set a new password",
    step3Subtitle: "Choose a strong password you don't use elsewhere",
    step3Submit:   "Reset password",
    successTitle:  "Password reset successfully!",
    successBody:   "Your password has been updated. You can now sign in with your new credentials.",
    successCta:    "Go to login",
    changeEmail:   "Change email",
    resend:        "Resend OTP",
    backToLogin:   "Back to login",
  },
  changePassword: {
    title:  "Change password",
    submit: "Update password",
  },
} as const;
