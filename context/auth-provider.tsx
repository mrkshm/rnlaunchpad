import { useRouter, useSegments, usePathname, SplashScreen } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  EmailOtpType,
  Session,
  SignInWithPasswordlessCredentials,
  User,
} from "@supabase/supabase-js";

import {
  changeEmail as changeEmailService,
  changePassword as changePasswordService,
  signInWithOtp as signInWithOtpService,
  signOut as signOutService,
  signUp as signUpService,
  signInWithPassword as signInWithPasswordService,
  verifyOtp as verifyOtpService,
} from "~/lib/auth-service";
import type { ProfileUpdate } from "~/lib/schemas-and-types";
import { supabase } from "~/lib/supabase-client";
import {
  getUserById,
  checkIfUserWithEmailExists,
  getUserByEmail,
} from "~/lib/user-service";

SplashScreen.preventAutoHideAsync();

type LoginArgs = {
  email: string;
  password: string;
};

type OtpVerificationArgs = {
  email: string;
  token: string;
  type?: EmailOtpType;
};

type AuthContextProps = {
  user: User | null;
  session: Session | null;
  profile: ProfileUpdate | null;
  fetchProfile: () => Promise<void>;
  initialized?: boolean;
  signUp: ({
    email,
    password,
  }: LoginArgs) => Promise<{ error: string; success: string }>;
  changePassword: ({ password }: { password: string }) => Promise<void>;
  changeEmail: ({ email }: { email: string }) => Promise<void>;
  signInWithPassword: ({ email, password }: LoginArgs) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOtp: ({ email, token }: OtpVerificationArgs) => Promise<void>;
  setIsVerifyingOtp?: (value: boolean) => void;
  resetPassword: (
    credentials: SignInWithPasswordlessCredentials
  ) => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  profile: null,
  fetchProfile: async () => {},
  initialized: false,
  signUp: async () => {
    return { success: "", error: "" };
  },
  signInWithPassword: async () => {},
  signOut: async () => {},
  verifyOtp: async () => {},
  resetPassword: async () => {},
  changePassword: async () => {},
  changeEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileUpdate | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session) return;
    const { data, error } = await getUserById({ userId: session.user.id });
    if (error) throw error;
    setProfile({
      user_name: data?.user_name,
      email: data?.email,
      image_url: data?.image_url,
      language: data?.language,
    });
  }, [session]);

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  const signUp = async ({ email, password }: LoginArgs) => {
    const { data: userExists, error: userExistsError } =
      await checkIfUserWithEmailExists({ email });

    if (userExistsError)
      console.log("error checking for user", userExistsError.message);
    if (userExists) {
      const { error } = await signInWithPasswordService({ email, password });
      if (error) return { error: error.message, success: "" };
      return { error: "", success: "login" };
    } else {
      const { error: signupError } = await signUpService({ email, password });
      if (signupError) return { error: signupError.message, success: "" };
      setIsVerifyingOtp(true);
      return { error: "", success: "signup" };
    }
  };

  const signInWithPassword = async ({ email, password }: LoginArgs) => {
    const { error } = await signInWithPasswordService({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await signOutService();
    if (error) throw error;
  };

  const verifyOtp = async ({
    email,
    token,
    type = "email",
  }: OtpVerificationArgs) => {
    console.log("Context has", email, type);
    const { error } = await verifyOtpService({
      email: email,
      token: token,
      type: type,
    });
    if (error) throw error;
    setIsVerifyingOtp(false);
  };

  const resetPassword = async (
    credentials: SignInWithPasswordlessCredentials
  ) => {
    if ("email" in credentials) {
      console.log("checking if user exists");
      const { data: getUserData, error: getUserError } = await getUserByEmail({
        email: credentials.email,
      });
      if (getUserError) throw getUserError;
      if (!getUserData) throw new Error("User not found");
      const { error } = await signInWithOtpService(credentials);
      if (error) throw error;
      setIsVerifyingOtp(true);
      console.log("otp email sent");
    }
  };

  const changeEmail = async ({ email }: { email: string }) => {
    const { error } = await changeEmailService({ email });
    if (error) throw error;
    setIsVerifyingOtp(true);
  };

  const changePassword = async ({ password }: { password: string }) => {
    const { error } = await changePasswordService({ password });
    if (error) throw error;
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === "(protected)";

    if (session && !inProtectedGroup) {
      router.replace("/(protected)/home");
    } else if (!session && !isVerifyingOtp) {
      router.replace("/(public)/welcome");
    } else if (isVerifyingOtp && pathname !== "/(public)/confirm") {
      router.replace("/(public)/confirm");
    } else if (
      !isVerifyingOtp &&
      pathname === "/(public)/confirm" &&
      !session
    ) {
      router.replace("/(public)/welcome");
    }

    /* HACK: Something must be rendered when determining the initial auth state...
  	instead of creating a loading screen, we use the SplashScreen and hide it after
  	a small delay (500 ms)
  	*/

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [initialized, session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        fetchProfile,
        initialized,
        signUp,
        signInWithPassword,
        signOut,
        verifyOtp,
        setIsVerifyingOtp,
        resetPassword,
        changePassword,
        changeEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
