import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  type?: "text" | "number" | "email" | "password" | "textarea";
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rows?: number;
  min?: string;
  step?: string;
  helperText?: string;
}

export default function FormField({
  id,
  label,
  required = false,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  rows = 5,
  min,
  step,
  helperText,
}: FormFieldProps) {
  const inputClassName = error ? "border-red-500" : "";

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={inputClassName}
        />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          step={step}
          className={inputClassName}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
