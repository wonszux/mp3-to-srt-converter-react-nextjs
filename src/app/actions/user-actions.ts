"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateEmail(newEmail: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Nie jesteś zalogowany." };
    }

    if (!newEmail || !newEmail.includes("@")) {
      return { success: false, message: "Nieprawidłowy format email." };
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, newEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, message: "Ten email jest już zajęty." };
    }

    await db
      .update(user)
      .set({ email: newEmail, emailVerified: true }) // Auto-verify since admin/user changed it directly
      .where(eq(user.id, session.user.id));

    return { success: true, message: "Adres email został zmieniony." };
  } catch (error) {
    console.error("Error updating email:", error);
    return { success: false, message: "Wystąpił błąd podczas zmiany emaila." };
  }
}
