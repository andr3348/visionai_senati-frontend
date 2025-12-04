"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { Activity, Home, ScanFace, UserIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/auth.context";
import LoginModal from "./auth/login-modal";
import { Button } from "./ui/button";
import RegisterModal from "./auth/signin-modal";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const items = [
  {
    title: "Home",
    url: ROUTES.home,
    icon: Home,
  },
  {
    title: "Emotion Detection",
    url: ROUTES.emotionDetection,
    icon: ScanFace,
  },
  {
    title: "Analytics",
    url: ROUTES.analytics,
    icon: Activity,
  },
];

export default function AppSidebar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
      setShowRegisterModal(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Sidebar collapsible="icon" variant="floating">
        {/* Scrollable content goes here */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {isLoading ? (
            <div className="p-2">Loading...</div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col gap-2 p-2">
              <Button
                onClick={() => setShowLoginModal(true)}
                className="w-full"
              >
                Login
              </Button>
              <Button
                onClick={() => setShowRegisterModal(true)}
                variant="outline"
                className="w-full"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full p-2 hover:bg-accent cursor-pointer rounded-md">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4" />
                    <span className="text-sm font-medium">
                      {user?.username}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        switchToRegister={() => setShowRegisterModal(true)}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        switchToLogin={() => setShowLoginModal(true)}
      />
    </>
  );
}
