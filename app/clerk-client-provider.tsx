"use client";

import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

export default function ClerkClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <header className="flex h-16 items-center justify-between gap-4 border-b border-stone-200 bg-[#f7f4ee] px-5 sm:px-8">
        <span className="text-sm font-bold text-stone-950">
          나의 가족 이야기
        </span>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <button className="h-10 cursor-pointer rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white">
                회원가입
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
      {children}
    </ClerkProvider>
  );
}
