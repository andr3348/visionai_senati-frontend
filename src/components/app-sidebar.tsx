"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { Activity, Home, ScanFace, UserIcon, ChevronDown, Upload, icons, Camera, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useAuth } from "@/contexts/auth.context";
import LoginModal from "./auth/login-modal";
import { Button } from "./ui/button";
import RegisterModal from "./auth/signin-modal";
import ProfileModal from "./profile-modal";
import SettingsModal from "./settings-modal";
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
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

const items = [
  {
    title: "Home",
    url: ROUTES.home,
    icon: Home,
  },
  {
    title: "Predictions",
    icon: ScanFace,
    items: [
      {
        title: "Live Emotion Detection",
        url: ROUTES.liveEmotionDetection,
        icon: Camera,
      },
      {
        title: "Emotion Detection",
        url: ROUTES.emotionDetection,
        icon: Upload,
      },
    ],
  },
  {
    title: "Analytics",
    url: ROUTES.analytics,
    icon: Activity,
  },
];

export default function AppSidebar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
      setShowRegisterModal(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Sidebar collapsible="icon" variant="floating">
        {/* Mobile close button */}
        {isMobile && (
          <SidebarHeader>
            <div className="flex items-center justify-between px-2 py-2">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSidebar()}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SidebarHeader>
        )}
        {/* Scrollable content goes here */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  // If item has nested items, render as collapsible
                  if ("items" in item && item.items) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                      {subItem.icon && <subItem.icon />}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // Regular item without nesting
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url!}>
                          <item.icon />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                !open ? (
                  <div className="flex items-center justify-center p-2">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                )
              ) : !isAuthenticated && open ? (
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
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:cursor-pointer">
                      <UserIcon />
                      <span>{user?.username}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56" 
                    side={isMobile ? "top" : "right"} 
                    align={isMobile ? "end" : "end"}
                    sideOffset={8}
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSettingsModal(true)}>
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => logout()}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </SidebarMenuItem>
          </SidebarMenu>
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
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}
