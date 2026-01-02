"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, TriangleAlert, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

// Import the server action we just updated
import { registerUser } from "@/actions/register";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const SignUpCard = () => {
  const router = useRouter();

  // --- State Management ---
  const [step, setStep] = useState<"email" | "password">("email");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isPending, setIsPending] = useState(false); // Replaces mutation.isPending

  // Form Data States
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Toggles
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [validationError, setValidationError] = useState("");

  // --- Handlers ---

  const handleTabChange = (value: string) => {
    if (value === "signin") {
      setLoading(true);
      router.push("/login"); // Changed from /sign-in to /login
    }
  };

  const onProviderSignUp = (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");
    signIn(provider, { callbackUrl: "/" });
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simple regex for email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Invalid email address");
      return;
    }
    setValidationError("");
    setStep("password");
  };

  const onCredentialSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");
    setIsPending(true);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      setIsPending(false);
      return;
    }

    if (!firstName || !lastName) {
      setValidationError("Please enter your full name");
      setIsPending(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // Create FormData to send to Server Action
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);

    // Call Server Action
    const result = await registerUser(formData);

    if (result.error) {
      setValidationError(result.error);
      setIsPending(false);
    } else {
      // Success: Auto Login
      console.log("Registration successful, attempting auto-login...");
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false, // Don't redirect automatically
      });
      console.log("SignIn result:", result);

      if (result?.ok) {
        console.log("SignIn successful, redirecting...");
        // Force a page reload to ensure session is updated
        window.location.href = "/";
      } else {
        console.log("SignIn failed:", result?.error);
        setValidationError("Account created but login failed. Please try signing in manually.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-50">
      {/* Left Side - Fixed */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 fixed left-0 top-0 h-screen overflow-hidden z-10">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center space-y-8">
            {/* Logo Placeholder */}
            <Link
              href="/"
              rel="noopener noreferrer"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto my-10"
              />
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Join TaskGenie
              </h1>
              <p className="text-lg text-slate-400 max-w-md mx-auto">
                Start organizing your tasks and boost your productivity with our
                intuitive todo application. Create your account to get started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Scrollable */}
      <div className="flex-1 lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-lg space-y-6">
            {/* Mobile Logo */}
              <Link
              href="/"
              rel="noopener noreferrer"
              className="lg:hidden block"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto my-10"
              />
            </Link>

            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="text-center space-y-0 pb-4">
                {/* Back Button for Password Step */}
                {step === "password" && (
                  <div className="flex justify-start mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("email")}
                      className="text-violet-500 hover:text-violet-400 hover:bg-transparent transition-colors text-sm"
                      disabled={loading || isPending}
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Back to email
                    </Button>
                  </div>
                )}

                <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                  {step === "email"
                    ? "Create your account"
                    : "Set your password"}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2 text-slate-400">
                  {step === "email"
                    ? "Start organizing your tasks and boost productivity"
                    : "Create a strong password to secure your account"}
                </CardDescription>

                {/* Show email confirmation in password step */}
                {step === "password" && (
                  <div className="mt-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-violet-400">
                      Signing up with:{" "}
                      <span className="font-medium text-violet-300">{email}</span>
                    </p>
                  </div>
                )}

                {/* Error Handling */}
                {!!validationError && (
                  <div className="mt-3 rounded-md border border-red-200/30 bg-red-900/30 px-3 py-2 text-sm text-red-300 flex items-center gap-2 justify-center">
                    <TriangleAlert className="size-4" />
                    {validationError}
                  </div>
                )}

                {/* Tabs */}
                <div className="flex justify-center w-full">
                  <Tabs
                    defaultValue="signup"
                    value="signup"
                    onValueChange={handleTabChange}
                    className="w-full mt-4"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-800">
                      <TabsTrigger value="signin" className="h-8 text-sm text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="h-8 text-sm text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* STEP 1: EMAIL & OAUTH */}
                {step === "email" && (
                  <>
                    {/* Google */}
                    <Button
                      variant="outline"
                      className="w-full h-10 sm:h-12 text-base sm:text-lg relative bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                      type="button"
                      onClick={() => onProviderSignUp("google")}
                      disabled={loading || loadingGithub}
                    >
                      {loadingGoogle ? (
                        <Loader2 className="mr-2 size-5 animate-spin" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-6 w-6"
                          viewBox="0 0 16 16"
                        >
                          <g fill="none" fillRule="evenodd" clipRule="evenodd">
                            <path
                              fill="#f44336"
                              d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                              opacity="0.987"
                            />
                            <path
                              fill="#ffc107"
                              d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                              opacity="0.997"
                            />
                            <path
                              fill="#448aff"
                              d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                              opacity="0.999"
                            />
                            <path
                              fill="#43a047"
                              d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                              opacity="0.993"
                            />
                          </g>
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative text-center text-sm">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-950 px-2 text-slate-400">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    {/* Email Input Form */}
                    <form onSubmit={handleEmailContinue} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-email"
                          className="text-base sm:text-lg text-slate-300"
                        >
                          Email address
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email address"
                          className="h-10 sm:h-12 text-base sm:text-lg bg-slate-800 border-slate-700 text-white"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-10 sm:h-12 text-base sm:text-lg bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                        disabled={!email || loading}
                      >
                        Continue with email
                      </Button>
                    </form>
                  </>
                )}

                {/* STEP 2: PASSWORD & DETAILS */}
                {step === "password" && (
                  <form onSubmit={onCredentialSignUp} className="space-y-4">
                    {/* Personal Info */}
                    <div className="space-y-3">
                      <h3 className="text-base sm:text-lg font-semibold text-violet-500">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm sm:text-base text-slate-300"
                          >
                            First name
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="First name"
                            className="h-10 sm:h-12 text-sm sm:text-base bg-slate-800 border-slate-700 text-white"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isPending}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm sm:text-base text-slate-300"
                          >
                            Last name
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            className="h-10 sm:h-12 text-sm sm:text-base bg-slate-800 border-slate-700 text-white"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isPending}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-3">
                      <h3 className="text-base sm:text-lg font-semibold text-violet-500">
                        Create Password
                      </h3>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm sm:text-base text-slate-300"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPw ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="h-10 sm:h-12 text-sm sm:text-base pr-10 bg-slate-800 border-slate-700 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isPending}
                            required
                            minLength={3}
                            maxLength={20}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                            tabIndex={-1}
                          >
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm"
                          className="text-sm sm:text-base text-slate-300"
                        >
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm"
                            type={showPw2 ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-10 sm:h-12 text-sm sm:text-base pr-10 bg-slate-800 border-slate-700 text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isPending}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw2((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                            tabIndex={-1}
                          >
                            {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <Button
                        type="submit"
                        className="w-full h-10 sm:h-12 text-base sm:text-lg bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                        disabled={loading || isPending}
                      >
                        {isPending || loading ? (
                          <>
                            <Loader2 className="mr-2 size-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Footer Links */}
                <div className="text-center text-sm sm:text-base text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-violet-500 hover:text-violet-400 transition-colors"
                    onClick={() => setLoading(true)}
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Terms Footer */}
            <div className="text-center text-xs text-slate-400">
              <p className="text-balance">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-medium text-violet-500 underline underline-offset-4 hover:text-violet-400 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-violet-500 underline underline-offset-4 hover:text-violet-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCard;
