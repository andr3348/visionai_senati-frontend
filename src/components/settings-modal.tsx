"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/theme.context";
import { Moon, Sun } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your application preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="space-y-0.5">
                <Label htmlFor="theme-toggle" className="text-base">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  {theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"}
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
