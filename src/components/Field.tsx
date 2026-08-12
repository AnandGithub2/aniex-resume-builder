import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">{children}</span>
      {hint ? <span className="text-[11px] text-[#8a8376]">{hint}</span> : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <Label hint={hint}>{label}</Label>
      <input
        {...props}
        className="w-full rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] px-3 py-2 text-[13.5px] text-ink outline-none transition focus:border-[#b7a078] focus:bg-white"
      />
    </label>
  );
}

export function AreaField({
  label,
  hint,
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <Label hint={hint}>{label}</Label>
      <textarea
        rows={rows}
        {...props}
        className="w-full resize-y rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] px-3 py-2 text-[13.5px] leading-relaxed text-ink outline-none transition focus:border-[#b7a078] focus:bg-white"
      />
    </label>
  );
}

export function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-[#6b4f2a]"
      />
      {label}
    </label>
  );
}
