import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";

export function SelectMultiple({ placeholder = 'Selecciona...', className, options, value, onChange }: {
    placeholder: string,
    className: string,
    options: { label: string; value: string }[],
    value: string[],
    onChange: (v: string[]) => void
}) {
    const toggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter(v => v !== val))
        } else {
            onChange([...value, val])
        }
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={
                cn(
                    "text-left",
                    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary",
                    "selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2",
                    "text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed",
                    "disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    className
                  )
            }>
                {value.length > 0 ? value.join(", ") : 
                    <span className="text-gray-500"> {placeholder} </span>
                }
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white border rounded-md shadow-md p-1">
                {options.map((opt) => (
                    <DropdownMenu.CheckboxItem
                        key={opt.value}
                        checked={value.includes(opt.value)}
                        onCheckedChange={() => toggle(opt.value)}
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-gray-100"
                    >
                        <span>{opt.label}</span>
                        {value.includes(opt.value) && <Check className="ml-auto size-4" />}
                    </DropdownMenu.CheckboxItem>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}
