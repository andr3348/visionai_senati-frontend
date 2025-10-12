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
import { Activity, Home, TvMinimalPlay } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const items = [
  {
    title: "Home",
    url: ROUTES.home,
    icon: Home,
  },
  {
    title: "Predict",
    url: ROUTES.predict,
    icon: TvMinimalPlay,
  },
  {
    title: "Activity",
    url: ROUTES.activity,
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
