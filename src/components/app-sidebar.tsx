import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { Activity, Home, ScanFace } from "lucide-react";
import { ROUTES } from "@/lib/constants";

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
  return (
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
    </Sidebar>
  );
}
