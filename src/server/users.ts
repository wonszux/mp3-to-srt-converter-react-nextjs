"use server";

import { auth } from "@/lib/auth";

export const signIn = async (
  email: string,
  password: string,
  rememberMe: boolean = true
) => {
  await auth.api.signInEmail({
    body: { email, password, rememberMe },
  });
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (error) {
    // NAPRAW SIE PROSZE
    console.error("Server-side signUp error details:", error);

    // AAAAAAAAAAAAAAAA
    throw error;
  }
};

export const setPassword = async (
  newPassword: string,
  headers: HeadersInit
) => {
  await auth.api.setPassword({
    body: { newPassword },
    headers,
  });
};
