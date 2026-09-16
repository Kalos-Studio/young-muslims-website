"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";

import { NavLink } from "./nav-link";
import { drawerLinks } from "./nav-links";

/**
 * The drawer behind the hamburger in the top right.
 *
 * It is the only way to reach Store and Blog, so it is not a mobile
 * afterthought — it carries real IA and it is permanent. Accordingly the
 * accessibility work lives here rather than being deferred:
 *
 * - Base UI's Dialog is modal, which gives us focus trapping while open,
 *   focus restored to the trigger on close, Escape to dismiss, and the rest of
 *   the page inerted for screen readers.
 * - The trigger carries an explicit label, because an icon alone announces
 *   nothing.
 * - Navigating closes the drawer. Without this it survives the route change and
 *   covers the page the visitor just asked for.
 */
export function SideNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="rounded-xs p-1 text-foreground outline-none hover:opacity-60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Menu className="size-6" strokeWidth={2.5} aria-hidden />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-foreground/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-0 right-0 bottom-0 flex w-[24rem] flex-col border-l border-border bg-background transition-transform duration-200 outline-none data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <div className="flex items-center justify-between border-b border-border px-8 py-6">
            <Dialog.Title className="text-sm font-medium text-muted-foreground">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              className="rounded-xs p-1 outline-none hover:opacity-60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <nav aria-label="Site" className="flex flex-col gap-5 px-8 py-8">
            {drawerLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onNavigate={() => setOpen(false)}
                className="text-h3 font-semibold no-underline hover:underline hover:underline-offset-8"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
