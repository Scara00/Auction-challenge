import { Link } from "react-router-dom";
import type { Category } from "@/types/auction";

interface CategoriesSidebarProps {
  categories: Category[];
  isLoading?: boolean;
}

export default function CategoriesSidebar({
  categories,
  isLoading = false,
}: CategoriesSidebarProps) {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h2 className="text-xl font-bold mb-4">Categorie</h2>
        <div className="flex flex-col gap-2">
          {isLoading
            ? // Skeleton loading
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded" />
                </div>
              ))
            : categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/search?category=${encodeURIComponent(category.id)}&categoryName=${encodeURIComponent(category.name)}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-sm truncate">{category.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {category._count?.auctions || 0}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </aside>
  );
}
