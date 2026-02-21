import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  error?: string;
  required?: boolean;
}

export default function CategorySelect({
  value,
  onChange,
  categories,
  error,
  required = false,
}: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label>
        Categoria {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Seleziona categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.icon} {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
