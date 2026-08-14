"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Menu,
    Search,
    Heart,
    MessageCircle,
    UserCircle,
    Bell,
    Settings,
    CircleHelp,
    LogOut,
    BriefcaseBusiness,
    Sun,
    Moon,
} from "lucide-react";
import Link from "next/link";
import LoginModal from "@/components/auth/login-modal";
import MessagesModal from "@/components/shared/messages-modal";

import Logo from "../shared/logo";
import SearchBar from "./searchBar";

interface HeaderProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const Header = ({
    activeTab: externalActiveTab,
    onTabChange,
}: HeaderProps = {}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const [internalActiveTab, setInternalActiveTab] = useState("Homes");
    const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
    const [initialSearchSection, setInitialSearchSection] =
        useState<"destination" | "dates" | "guests" | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    // Theme hook for Dark Mode
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

    const navItems = [
        { videoSrc: "/videos/house.webm", label: "Homes" },
        { videoSrc: "/videos/balloon.webm", label: "Experiences" },
        { videoSrc: "/videos/consierge.webm", label: "Services" },
    ];

    const handleTabClick = (label: string) => {
        if (onTabChange) {
            onTabChange(label);
        } else {
            setInternalActiveTab(label);
            router.push(`/?tab=${label}`);
        }
    };

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
                setIsExpanded(false);
            } else {
                setIsScrolled(false);
                setIsExpanded(true);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check localStorage for logged-in user
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setUserName(parsed.name || parsed.email || "");
                    setIsLoggedIn(true);
                } catch {
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
                setUserName("");
            }
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isMenuOpen]);

    const showExpanded = !isScrolled || isExpanded;

    const handleBackdropClick = () => {
        if (isScrolled && isExpanded) {
            setIsExpanded(false);
        }
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const handleOpenLogin = () => {
        setAuthModalMode("login");
        setIsMenuOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("");
        setIsMenuOpen(false);
        router.refresh();
    };

    const handleLoginSuccess = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserName(parsed.name || parsed.email || "");
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to read logged-in user:", error);
            }
        } else {
            setIsLoggedIn(true);
        }
    };

    const userInitial = userName
        ? userName.charAt(0).toUpperCase()
        : "G";

    return (
        <>
            {/* Backdrop */}
            {(isScrolled && isExpanded) || isMenuOpen ? (
                <div
                    className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 backdrop-blur-[2px] transition-opacity"
                    onClick={handleBackdropClick}
                />
            ) : null}

            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md w-full border-b border-gray-200 dark:border-[#2a2a2a] shadow-sm dark:shadow-none transition-all duration-300 ease-in-out ${
                    showExpanded ? "h-[200px]" : "h-20"
                }`}
            >
                <nav className="h-20 flex items-center justify-between w-full max-w-[1824px] mx-auto px-6 md:px-10 lg:px-12">

                    {/* LOGO */}
                    <div 
                        onClick={() => {
                            if (onTabChange) onTabChange("Homes");
                            router.push("/");
                        }}
                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                    >
                        <Logo />
                    </div>

                    {/* TOP NAVIGATION (Videos) */}
                    <div
                        className={`hidden lg:flex items-center gap-6 transition-all duration-300 ${
                            showExpanded
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none absolute"
                        }`}
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleTabClick(item.label)}
                                className={`flex items-center gap-3 cursor-pointer group pb-2 border-b-2 transition-all duration-200 ${
                                    activeTab === item.label
                                        ? "border-black dark:border-white"
                                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                            >
                                <video
                                    src={item.videoSrc}
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                    className="w-14 h-14 transition-transform duration-200 group-hover:scale-110"
                                />

                                <span
                                    className={`text-sm font-semibold transition-colors duration-200 ${
                                        activeTab === item.label
                                            ? "text-gray-900 dark:text-white"
                                            : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* COMPACT SEARCH WHEN SCROLLED */}
                    <div
                        className={`hidden lg:flex items-center gap-4 flex-1 max-w-[478px] h-12 transition-all duration-300 ${
                            !showExpanded
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none absolute"
                        }`}
                    >
                        <div className="flex items-center justify-center bg-white dark:bg-[#242424] border border-gray-300 dark:border-[#383838] rounded-full hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-200 w-full h-full">

                            <video
                                src="/videos/house.webm"
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="w-7 h-7 ml-4"
                            />

                            <button
                                onClick={() => {
                                    setInitialSearchSection("destination");
                                    setIsExpanded(true);
                                }}
                                className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2e2e2e] rounded-full transition-colors cursor-pointer"
                            >
                                Anywhere
                            </button>

                            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                            <button
                                onClick={() => {
                                    setInitialSearchSection("dates");
                                    setIsExpanded(true);
                                }}
                                className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2e2e2e] rounded-full transition-colors cursor-pointer"
                            >
                                Anytime
                            </button>

                            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                            <button
                                onClick={() => {
                                    setInitialSearchSection("guests");
                                    setIsExpanded(true);
                                }}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2e2e2e] rounded-full transition-colors cursor-pointer"
                            >
                                Add Guests
                            </button>

                            <div className="bg-primary text-white p-2 rounded-full mr-1">
                                <Search className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 relative">

                        {/* Become a host */}
                        <Link
                            href="/become-a-host"
                            className="hidden md:block text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-gray-800 dark:text-gray-200 transition-all duration-200 cursor-pointer"
                        >
                            Become a host
                        </Link>

                        {/* DARK MODE TOGGLE (Replaced Globe) */}
                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] rounded-full transition-all duration-200 cursor-pointer text-gray-700 dark:text-gray-200"
                            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                            aria-label="Toggle dark mode"
                        >
                            {mounted ? (
                                isDark ? (
                                    <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200 transition-transform duration-300 hover:-rotate-12" />
                                )
                            ) : (
                                <div className="w-5 h-5" />
                            )}
                        </button>

                        {/* MENU BUTTON */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#242424] border border-gray-300 dark:border-[#383838] rounded-full hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                            <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />

                            <div className="w-8 h-8 bg-gray-200 dark:bg-[#383838] rounded-full flex items-center justify-center">
                                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                                    {userInitial}
                                </span>
                            </div>
                        </button>

                        {/* ================= MENU ================= */}
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 top-14 w-[320px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-gray-200 dark:border-[#333333] overflow-hidden z-[60] text-gray-800 dark:text-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >

                                {!isLoggedIn ? (

                                    /* ================= LOGGED OUT ================= */
                                    <div className="py-2">

                                        {/* SIGN UP */}
                                        <button
                                            onClick={() => {
                                                setAuthModalMode("register");
                                                setIsMenuOpen(false);
                                                setIsLoginModalOpen(true);
                                            }}
                                            className="w-full text-left px-5 py-3.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                                        >
                                            Sign up
                                        </button>

                                        {/* LOGIN */}
                                        <button
                                            onClick={() => {
                                                setAuthModalMode("login");
                                                setIsMenuOpen(false);
                                                setIsLoginModalOpen(true);
                                            }}
                                            className="w-full text-left px-5 py-3.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                                        >
                                            Log in
                                        </button>

                                        <div className="border-t border-gray-200 dark:border-[#333333] my-1" />

                                        <Link
                                            href="/become-a-host"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                                        >
                                            Become a host
                                        </Link>

                                        <button className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                                            Refer a host
                                        </button>

                                        <button className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                                            Find a co-host
                                        </button>

                                        <div className="border-t border-gray-200 dark:border-[#333333] my-1" />

                                        {/* DARK MODE QUICK TOGGLE IN MENU */}
                                        <button
                                            onClick={() => setTheme(isDark ? "light" : "dark")}
                                            className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between"
                                        >
                                            <span>Dark mode</span>
                                            {isDark ? (
                                                <Sun className="w-4 h-4 text-amber-400" />
                                            ) : (
                                                <Moon className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>

                                        <button className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-3">
                                            <CircleHelp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Help Centre
                                        </button>

                                    </div>

                                ) : (

                                    /* ================= LOGGED IN ================= */
                                    <div className="py-2">

                                        {/* USER INFO */}
                                        <div className="px-5 py-3 border-b border-gray-200 dark:border-[#333333]">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Logged in
                                            </p>
                                        </div>

                                        {/* WISHLISTS */}
                                        <Link
                                            href="/wishlists"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                                        >
                                            <Heart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Wishlists
                                        </Link>

                                        {/* TRIPS / BOOKINGS */}
                                        <Link
                                            href="/bookings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                                        >
                                            <BriefcaseBusiness className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Trips
                                        </Link>

                                        {/* MESSAGES */}
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsMessagesModalOpen(true);
                                            }}
                                            className="w-full flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <span>Messages</span>
                                            </div>
                                            <span className="px-1.5 py-0.5 rounded-full bg-[#FF385C] text-white text-[10px] font-bold">
                                                1
                                            </span>
                                        </button>

                                        {/* NOTIFICATIONS */}
                                        <button className="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                                            <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Notifications
                                        </button>

                                        <div className="border-t border-gray-200 dark:border-[#333333] my-1" />

                                        {/* MANAGE LISTINGS / BECOME A HOST */}
                                        <Link
                                            href="/become-a-host"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                                        >
                                            Airbnb your home
                                        </Link>

                                        {/* PROFILE / ACCOUNT */}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                                        >
                                            <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Account
                                        </Link>

                                        <div className="border-t border-gray-200 dark:border-[#333333] my-1" />

                                        {/* DARK MODE QUICK TOGGLE IN MENU */}
                                        <button
                                            onClick={() => setTheme(isDark ? "light" : "dark")}
                                            className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between"
                                        >
                                            <span>Dark mode</span>
                                            {isDark ? (
                                                <Sun className="w-4 h-4 text-amber-400" />
                                            ) : (
                                                <Moon className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>

                                        {/* HELP */}
                                        <button className="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                                            <CircleHelp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            Help Centre
                                        </button>

                                        {/* LOGOUT */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-red-600 dark:text-red-400"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>

                                    </div>

                                )}

                            </div>
                        )}

                    </div>

                </nav>

                {/* SEARCH BAR */}
                <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
                        showExpanded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                >
                    <SearchBar
                        key={initialSearchSection}
                        initialSection={initialSearchSection}
                    />
                </div>
            </header>

            {/* LOGIN MODAL */}
            {isLoginModalOpen && (
                <LoginModal
                    initialMode={authModalMode}
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {/* MESSAGES & HOST INBOX MODAL */}
            <MessagesModal
                isOpen={isMessagesModalOpen}
                onClose={() => setIsMessagesModalOpen(false)}
            />
        </>
    );
};

export default Header;