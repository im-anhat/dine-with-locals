import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onRemove?: () => void;
}


const CategoryBadge = ({
  children,
  onRemove,
  ...props
}: CategoryBadgeProps) => {

  return (
    <Badge
      variant="outline"
      className={cn(
        'p-0 pr-2 pl-2 flex items-center gap-1 mb-2 hover:bg-gray-100',
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            onRemove();
          }}
        >
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
}

export default CategoryBadge;