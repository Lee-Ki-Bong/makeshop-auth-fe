"use client";

import { cn } from "@/lib/utils";
import { useState, FormEvent } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/useSignUp";
import { generateTestUser } from "@/lib/generateTestUser";

// 유효성 검증 스키마
const SignupSchema = z.object({
  loginUid: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(6, "비밀번호는 6자 이상"),
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("올바른 이메일 형식이 아닙니다"),
  name: z.string().min(1, "담당자명을 입력하세요"),
  phone: z.string().min(10, "전화번호를 입력하세요"),
});

export function SignUpForm() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id");
  const state = searchParams.get("state");

  const addLog = useAuthStore((s) => s.addLog);

  const [form, setForm] = useState({
    loginUid: "",
    password: "",
    email: "",
    name: "",
    phone: "",
  });

  const { mutate: signup, isPending } = useSignUp(clientId, state);

  const onChange = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const result = SignupSchema.safeParse(form);
    // if (!result.success) {
    //   const errors = z.flattenError(result.error).fieldErrors;
    //   addLog({
    //     status: "error",
    //     error: errors,
    //     timestamp: new Date().toISOString(),
    //   });
    //   return;
    // }
    signup(form);
  };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm">
          Makeshop SSO 신규 계정 생성
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => setForm(generateTestUser())}
      >
        🧪 Fill Test User
      </Button>

      <FieldGroup>
        <Field>
          <FieldLabel>ID</FieldLabel>
          <Input
            placeholder="아이디"
            value={form.loginUid}
            onChange={(e) => onChange("loginUid", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            placeholder="이메일"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>담당자명</FieldLabel>
          <Input
            placeholder="이름"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>전화번호</FieldLabel>
          <Input
            placeholder="전화번호"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </Field>
      </FieldGroup>

      {/* 추가 정보 - Optional UI 개선 */}
      {/* <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="corp">
          <AccordionTrigger>사업자 정보 입력</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Field>
              <FieldLabel>상호명</FieldLabel>
              <Input
                placeholder="상호명"
                value={form.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>사업자등록번호</FieldLabel>
              <Input
                placeholder="사업자등록번호"
                value={form.businessNumber}
                onChange={(e) => onChange("businessNumber", e.target.value)}
              />
            </Field>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      {/* 버튼 */}
      <Field>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </Field>

      <FieldDescription className="text-center text-sm">
        Already have an account?{" "}
        <a
          href={`/signin${
            clientId && state ? `?client_id=${clientId}&state=${state}` : ""
          }`}
          className="underline underline-offset-4"
        >
          Sign in
        </a>
      </FieldDescription>
    </form>
  );
}
