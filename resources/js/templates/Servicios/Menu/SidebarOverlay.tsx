import { useSidebar } from "./sidebar";

export function SidebarOverlay() {
  const { open, setOpen } = useSidebar();
  if(!open) return ;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onClick={() => setOpen(false)}
    />
  );
}
