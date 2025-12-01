import { supabase } from "@/supabase/client";
export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthenticatedUser {
  user: User;
  profile: UserProfile;
}

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<AuthenticatedUser | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, // Use the passed email parameter
      password, // Use the passed password parameter
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      return null;
    }

    console.log("Login Data:", data);

    const profile = await authService.getProfile(data.user.id);

    return {
      user: data.user as unknown as User,
      profile,
    };
  },

  async signup(
    name: string,
    email: string,
    role: UserRole,
    password: string
  ): Promise<void> {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role,
            name,
          },
        },
      });

      if (signUpError) throw signUpError;

      console.log(data);
      alert("Check your email for the confirmation link!");
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      throw new Error(error.message);
    }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("Fetched profile : ", profile, userId);

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return profile as UserProfile;
  },
};
