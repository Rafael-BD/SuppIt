import { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/src/components/ui/separator";
import { SidebarNav } from "@/src/components/sidebarNav";
import TopBar from "@/src/components/topBar";
import HomeButton from "@/src/components/home-btn";
import ThemeToggleButton from "@/src/components/ThemeToggle-btn";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings and set e-mail preferences.",
};

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/profile",
    },
    {
        title: "Page",
        href: "/profile/page",
    },
    {
        title: "Payments",
        href: "/profile/payments",
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <TopBar>
                <HomeButton />
                <div className="flex items-center justify-center space-x-6">
                    <Link href="/dashboard">
                        <p className="text-md border border--border p-2 rounded">Dashboard</p>
                    </Link>
                    <ThemeToggleButton />
                </div>
            </TopBar>
            <div className="hidden space-y-6 p-10 pb-16 mt-10 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">{children}</div>
                </div>
            </div>
        </>
    );
}