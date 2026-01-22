"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { useSignIn } from "@/hooks/useSignIn"; // ✅ 커스텀 훅 연결

// 입력 검증 S
import z from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchParams } from "next/navigation";
export const LoginSchema = z.object({
  userId: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});
// 입력 검증 E

export function LoginForm() {
  // oauth, oidc 용 파라미터
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id");
  const state = searchParams.get("state");

  // const submittingRef = useRef(false);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const addLog = useAuthStore((userState) => userState.addLog);

  const { mutate: startOAuth, isPending } = useSignIn();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 액션 막기

    // if (submittingRef.current) return; // ✅ 두 번째 호출 차단
    // submittingRef.current = true;

    // ✅ Zod 유효성 검사
    const validationFields = LoginSchema.safeParse({ userId, password });
    if (!validationFields.success) {
      const errors = z.flattenError(validationFields.error).fieldErrors;
      // submittingRef.current = false; // ❗ 실패 시 다시 열어줌
      addLog({
        status: "error",
        error: errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ✅ 커스텀 훅 실행 → 인증 백엔드(/internal/verify-user) 호출
    startOAuth({
      id: userId,
      password,
      clientId,
      state,
    });
  };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your ID below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="userId">User ID</FieldLabel>
          <Input
            id="userId"
            type="text"
            placeholder="아이디 입력"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          {/** 회원가입이였다가, 갑자기 로그인 요청으로 바뀌는게 정당한건가? */}
          <a
            href={`/signup${
              clientId && state ? `?client_id=${clientId}&state=${state}` : ""
            }`}
            className="underline underline-offset-4"
          >
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
