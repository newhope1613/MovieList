import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type DropdownType = {
  value: string;
  onValueChange: (a: string) => void;
  children: React.ReactNode;
};

const Dropdown = ({ value, onValueChange, children }: DropdownType) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 underline"
        >
          Genre
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 cursor-pointer" sideOffset={15}>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={onValueChange}
            className="text-indigo-500"
          >
            {children}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
