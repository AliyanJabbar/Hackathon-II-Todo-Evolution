"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react"; // Import useEffect
import { signIn } from "next-auth/react";
import { Loader2, TriangleAlert, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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

// Import the server action
import { checkEmailStatus } from "@/actions/check-user-existence"; // Ensure this path matches your file

const SignIn = () => {
  const router = useRouter();
  const params = useSearchParams();

  // State variables
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // NEW: Local Error State
  const [errorState, setErrorState] = useState("");
  const [createdMsg, setCreatedMsg] = useState(params.get("created"));

  // Effect: Sync URL errors to local state on initial load only
  useEffect(() => {
    const urlError = params.get("error");
    if (urlError) {
      setErrorState(
        urlError === "CredentialsSignin"
          ? "Invalid email or password"
          : urlError
      );
    }
  }, [params]);

  // 1. Handle Credential Login (Email/Pass)
  const onCredentialSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔴 CRITICAL FIX: Clear previous errors immediately on submit
    setErrorState("");
    setCreatedMsg(null);

    setLoading(true);
    setLoadingLogin(true);

    try {
      // --- STEP 1: Check if this email belongs to a Google-only account ---
      const status = await checkEmailStatus(email);

      if (status.error) {
        setLoading(false);
        setLoadingLogin(false);
        setErrorState(status.error); // Set local error
        return;
      }
      // ---------------------------------------------------------------------
    } catch (err) {
      console.error("Auth check failed", err);
    }

    // --- STEP 2: Proceed with standard Auth.js Login ---
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setLoadingLogin(false);
      setErrorState("Invalid email or password"); // Set local error
    } else {
      // Success!
      router.push("/");
      router.refresh(); // Ensure the new session is loaded
    }
  };

  // 2. Handle Google Login
  const onProviderSignIn = (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");

    signIn(provider, { callbackUrl: "/" });
  };

  const handleTabChange = (value: string) => {
    if (value === "signup") {
      setLoading(true);
      router.push("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-50">
      {/* Left Side - Logo and Terms */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 fixed left-0 top-0 h-screen overflow-hidden z-10">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center space-y-8">
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
                Welcome to TaskGenie
              </h1>
              <p className="text-lg text-slate-400 max-w-md">
                Manage your tasks efficiently with our intuitive todo application.
                Sign in to get started on organizing your productivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-lg space-y-2">
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
                <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome back to TaskGenie
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2 text-slate-400">
                  Sign in with Google or continue with your email
                </CardDescription>

                {/* Tabs */}
                <div className="flex justify-center w-full">
                  <Tabs
                    defaultValue="signin"
                    value="signin"
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

                {/* Alerts/Errors */}
                {createdMsg && (
                  <div
                    className="mt-4 rounded-md border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                    role="status"
                  >
                    Your account has been created. Please sign in.
                  </div>
                )}
                {!!errorState && (
                  <div className="mt-4 bg-red-900/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-300">
                    <TriangleAlert className="size-4" />
                    <p>{errorState}</p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Google Button */}
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-12 text-base sm:text-lg relative bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                  type="button"
                  onClick={() => onProviderSignIn("google")}
                  disabled={loading}
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
                <div className="relative text-center text-sm py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-2 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={onCredentialSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base sm:text-lg text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      type="email"
                      disabled={loading}
                      className="h-10 sm:h-12 text-base sm:text-lg bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-base sm:text-lg text-slate-300"
                      >
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm sm:text-base font-medium text-violet-500 hover:text-violet-400 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        type={showPw ? "text" : "password"}
                        disabled={loading}
                        className="h-10 sm:h-12 text-base sm:text-lg pr-12 bg-slate-800 border-slate-700 text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        aria-label={showPw ? "Hide password" : "Show password"}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400">
                    <p className="text-balance">
                      By using this service, you agree to our{" "}
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

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 text-base sm:text-lg bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                    disabled={loading}
                    size="lg"
                  >
                    {loadingLogin ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center text-sm sm:text-base text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      onClick={() => setLoading(true)}
                      className="font-bold text-violet-500 hover:text-violet-400 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
