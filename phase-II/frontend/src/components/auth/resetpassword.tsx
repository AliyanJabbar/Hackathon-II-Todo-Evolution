"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, TriangleAlert, Check, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/actions/reset-password";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export function ResetPasswordCard() {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) return setError("Invalid or missing token.");
    if (password !== confirm) return setError("Passwords do not match.");

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);

      const res = await updatePassword(formData);

      if (res.error) setError(res.error);
      if (res.success) setSuccess(res.success);
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-50">
        {/* Left Side - Branding */}
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
                <h1 className="text-4xl font-bold text-white">TaskGenie</h1>
                <p className="text-lg text-slate-400 max-w-md">
                  Securely reset your password and regain access to your TaskGenie account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
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
                    Invalid Link
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg mt-2 text-slate-400">
                    Missing or invalid token.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center text-sm sm:text-base text-slate-400 mt-4">
                    <Link
                      href="/forgot-password"
                      className="font-bold text-violet-500 hover:text-violet-400 transition-colors inline-flex items-center"
                    >
                      Request New Reset Link
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-50">
      {/* Left Side - Branding (Matches ForgotPassword) */}
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
              <h1 className="text-4xl font-bold text-white">TaskGenie</h1>
              <p className="text-lg text-slate-400 max-w-md">
                Securely reset your password and regain access to your TaskGenie account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2 text-slate-400">
                  Enter your new password to complete your reset.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Message */}
                {success && (
                  <div
                    className="mt-4 rounded-md border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                    role="status"
                  >
                    <Check className="w-4 h-4 mr-2 inline-block" />
                    <p className="inline-block">{success}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-900/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-300">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-base sm:text-lg text-slate-300"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="h-10 sm:h-12 text-base sm:text-lg pr-10 bg-slate-800 border-slate-700 text-white"
                        disabled={isPending}
                        required
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
                      className="text-base sm:text-lg text-slate-300"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        type={showPw2 ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm your new password"
                        className="h-10 sm:h-12 text-base sm:text-lg pr-10 bg-slate-800 border-slate-700 text-white"
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

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 text-base sm:text-lg bg-violet-600 border-none text-white hover:text-white hover:bg-violet-500 cursor-pointer"
                    disabled={isPending}
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center text-sm sm:text-base text-slate-400 mt-4">
                    <Link
                      href="/login"
                      className="font-bold text-violet-500 hover:text-violet-400 transition-colors inline-flex items-center"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Login
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
}
