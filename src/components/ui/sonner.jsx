import { Toaster as Sonner, toast } from "sonner";

export const Toaster = () => (
  <Sonner
    position="bottom-right"
    richColors
    closeButton
    duration={3000}
    theme="light" // Or "dark", or "system"
    className="z-[9999]"
  />
);

export { toast };
