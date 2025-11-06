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
import { FormEvent, useState } from "react";
import { useStartOAuth } from "@/hooks/useStartOAuth"; // ✅ 커스텀 훅 연결

// 입력 검증 S
import z from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("올바른 이메일 형식이 아닙니다"),

  password: z.string().min(1, "비밀번호를 입력하세요"),
});
// 입력 검증 E

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addLog = useAuthStore((state) => state.addLog);

  const { mutate: startOAuth, isPending } = useStartOAuth(email, password);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 액션 막기

    // ✅ Zod 유효성 검사
    const validationFields = LoginSchema.safeParse({ email, password });
    if (!validationFields.success) {
      const errors = z.flattenError(validationFields.error).fieldErrors;
      addLog({
        status: "error",
        error: errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ✅ 커스텀 훅 실행 → 인증 백엔드(/internal/verify-user) 호출
    startOAuth();
  };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
