"use client";

import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavigationNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();

	const menuItems = [
		{ name: "New Search", href: "/" },
		{ name: "Lookups", href: "/lookups" },
		{ name: "Billing", href: "/billing" },
		{ name: "Settings", href: "/settings" },
		// { name: "Auth", href: "/auth" },
	];

	return (
		<Navbar
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			className="bg-background"
		>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<NavbarBrand>
					<Link className="font-bold text-xl text-primary md:text-2xl" href="/">
						✈ Cheap Radar
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{menuItems.map((item) => (
					<NavbarItem key={item.name} isActive={pathname === item.href}>
						<Link
							color={pathname === item.href ? "primary" : "foreground"}
							href={item.href}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<Button color="primary" isDisabled variant="flat">
						Sign In
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{menuItems.map((item) => (
					<NavbarMenuItem key={item.name}>
						<Link
							color={pathname === item.href ? "primary" : "foreground"}
							className="w-full text-lg"
							href={item.href}
							size="lg"
							onPress={() => setIsMenuOpen(false)}
						>
							{item.name}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
