"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "All Course",
    url: "/dashboard/all-courses",
    icon: Home,
  },
  {
    title: "Add Course",
    url: "/dashboard/add-course",
    icon: Inbox,
  },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
];

export function AppSidebar() {
  return (
    <Sidebar className='bg-white border-r border-gray-200'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00564A] to-[#00A892] px-4 py-2'>
            <Link href='/'>Datapollex LMS</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-3 py-10'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600",
                      "hover:bg-gradient-to-r hover:from-[#3DB6A6] hover:to-[#2D7F74] hover:text-white",
                      "transition-colors duration-300"
                    )}>
                    <a href={item.url}>
                      <item.icon className='h-5 w-5 hover:text-white' />
                      <span>{item.title}</span>
                    </a>
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
