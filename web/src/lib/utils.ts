import { User } from "@/components/provider/auth";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import invariant from "tiny-invariant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeToken(input: { token: string }): User {
  const [, payloadEncoded] = input.token.split(".");
  invariant(payloadEncoded, "Invalid access token");
  const payload = JSON.parse(
    atob(payloadEncoded.replace(/-/g, "+").replace(/_/g, "/"))
  );
  console.log("🤖 Decoded token", JSON.stringify(payload, null, 2));
  return {
    ...payload,
    token: input.token,
  };
}

export const store = {
  get() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as User;
  },
  set(input: { user: User }) {
    return localStorage.setItem("user", JSON.stringify(input.user));
  },
  remove() {
    return localStorage.removeItem("user");
  },
};
