import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserResponse } from "@/types/user";

interface FormData {
  name: string;
  surname: string;
  phone: string;
  description: string;
}

interface PersonalInfoFormProps {
  userData: UserResponse | null;
  formData: FormData;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function PersonalInfoForm({
  userData,
  formData,
  isEditing,
  onInputChange,
}: PersonalInfoFormProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Informazioni Personali</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          {isEditing ? (
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Il tuo nome"
            />
          ) : (
            <p className="text-gray-700 py-2">{userData?.name || "N/A"}</p>
          )}
        </div>

        <div>
          <Label htmlFor="surname">Cognome</Label>
          {isEditing ? (
            <Input
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={onInputChange}
              placeholder="Il tuo cognome"
            />
          ) : (
            <p className="text-gray-700 py-2">{userData?.surname || "N/A"}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <p className="text-gray-700 py-2">{userData?.email || "N/A"}</p>
        </div>

        <div>
          <Label htmlFor="phone">Telefono</Label>
          {isEditing ? (
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="+393331110088"
            />
          ) : (
            <p className="text-gray-700 py-2">{userData?.phone || "N/A"}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Biografia</Label>
          {isEditing ? (
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Scrivi qualcosa su di te..."
              rows={4}
            />
          ) : (
            <p className="text-gray-700 py-2">
              {userData?.description || "Nessuna descrizione"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
