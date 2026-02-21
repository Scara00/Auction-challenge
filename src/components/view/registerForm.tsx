import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onClickRegister: (data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<
  React.ComponentProps<"form"> & RegisterFormProps
> = ({ className, onClickRegister, isLoading, ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri");
      return;
    }

    await onClickRegister({ email, password, name, surname, phone });
  };

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={handleSubmit}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea un nuovo account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Inserisci i tuoi dati per registrarti
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Mario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="surname">Cognome</FieldLabel>
            <Input
              id="surname"
              type="text"
              placeholder="Rossi"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="mario@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Telefono</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="+39 123 456 7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Conferma Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrazione...
              </>
            ) : (
              "Registrati"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Hai già un account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Accedi
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};
