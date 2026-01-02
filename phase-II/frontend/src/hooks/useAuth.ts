// Better Auth client-side hook for session management
import { useAuth as useBetterAuth } from "@/auth";

export const useAuth = () => {
  const { data: session, status, signIn, signOut, update } = useBetterAuth();

  return {
    user: session?.user || null,
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    signIn,
    signOut,
    update,
  };
};