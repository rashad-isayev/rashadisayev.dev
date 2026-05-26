"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, LogIn, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const icons = {
  login: LogIn,
  save: Save,
  trash: Trash2,
};

type AdminSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  icon?: keyof typeof icons;
  className?: string;
};

export function AdminSubmitButton({
  children,
  pendingLabel = "Saving",
  icon,
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const Icon = icon ? icons[icon] : null;

  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : Icon ? (
        <Icon aria-hidden className="size-4" />
      ) : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
