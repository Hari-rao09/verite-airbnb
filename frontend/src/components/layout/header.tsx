"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Globe,
    Menu,
    Search,
    Heart,
    MessageCircle,
    UserCircle,
    Bell,
    Settings,
    Languages,
    CircleHelp,
    LogOut,
    BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import LoginModal from "@/components/auth/login-modal";

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
    const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

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

    // Check login status
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setUserName(parsedUser.name || "");
            } catch (error) {
                console.error("Failed to read user:", error);
            }
        } else {
            setUserName("");
        }
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 80;

            setIsScrolled(scrolled);

            if (!scrolled) {
                setIsExpanded(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const showExpanded = !isScrolled || isExpanded;

    const handleBackdropClick = () => {
        setIsExpanded(false);
        setInitialSearchSection(null);
        setIsMenuOpen(false);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUserName("");
        setIsMenuOpen(false);
        setIsLoginModalOpen(false);

        // Airbnb-style: stay on the homepage
        window.location.href = "/";
    };

    // Open login modal
    const handleOpenLogin = () => {
        setIsMenuOpen(false);
        setIsLoginModalOpen(true);
    };

    // Login successful
    const handleLoginSuccess = () => {
        const user = localStorage.getItem("user");

        if (user) {
            try {
                const parsedUser = JSON.parse(user);

                setUserName(parsedUser.name || "");
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
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={handleBackdropClick}
                />
            ) : null}

            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center bg-navbar w-full border-b border-border-primary shadow-sm transition-all duration-300 ease-in-out ${showExpanded ? "h-[200px]" : "h-20"
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

                    {/* TOP NAVIGATION */}
                    <div
                        className={`hidden lg:flex items-center gap-6 transition-all duration-300 ${showExpanded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none absolute"
                            }`}
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleTabClick(item.label)}
                                className={`flex items-center border-b-2 pr-4 transition-all duration-200 cursor-pointer group ${activeTab === item.label
                                    ? "border-gray-800"
                                    : "border-transparent hover:border-gray-400"
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
                                    className={`text-sm font-semibold transition-colors duration-200 ${activeTab === item.label
                                        ? "text-gray-800"
                                        : "text-gray-600 group-hover:text-gray-800"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* COMPACT SEARCH WHEN SCROLLED */}
                    <div
                        className={`hidden lg:flex items-center gap-4 flex-1 max-w-[478px] h-12 transition-all duration-300 ${!showExpanded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none absolute"
                            }`}
                    >
                        <div className="flex items-center justify-center bg-white border border-gray-300 rounded-full hover:shadow-lg transition-all duration-200 w-full h-full">

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
                                className="flex-1 px-3 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                            >
                                Anywhere
                            </button>

                            <div className="h-5 w-px bg-gray-300" />

                            <button
                                onClick={() => {
                                    setInitialSearchSection("dates");
                                    setIsExpanded(true);
                                }}
                                className="flex-1 px-3 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                            >
                                Anytime
                            </button>

                            <div className="h-5 w-px bg-gray-300" />

                            <button
                                onClick={() => {
                                    setInitialSearchSection("guests");
                                    setIsExpanded(true);
                                }}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
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
                        <button className="hidden md:block text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                            Become a host
                        </button>

                        {/* Globe */}
                        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer">
                            <Globe className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* MENU BUTTON */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <Menu className="w-4 h-4 text-gray-700" />

                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 text-sm font-medium">
                                    {userInitial}
                                </span>
                            </div>
                        </button>

                        {/* ================= MENU ================= */}
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 top-14 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-[60]"
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
                                            className="w-full text-left px-5 py-3.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
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
                                            className="w-full text-left px-5 py-3.5 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Log in
                                        </button>

                                        <div className="border-t border-gray-200 my-1" />

                                        <button className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors">
                                            Become a host
                                        </button>

                                        <button className="w-full text-left px-5 py-4 text-sm hover:bg-gray-50">
                                            Refer a host
                                        </button>

                                        <button className="w-full text-left px-5 py-4 text-sm hover:bg-gray-50">
                                            Find a co-host
                                        </button>

                                        <div className="border-t border-gray-200" />

                                        <button className="w-full flex items-center gap-3 text-left px-5 py-4 text-sm hover:bg-gray-50">
                                            <CircleHelp className="w-5 h-5" />
                                            Help Centre
                                        </button>

                                    </div>

                                ) : (

                                    /* ================= LOGGED IN ================= */
                                    <div className="py-2">

                                        {/* Wishlist */}
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                router.push("/wishlists");
                                            }}
                                            className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50"
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span>Wishlists</span>
                                        </button>

                                        {/* Trips */}
                                        <Link
                                            href="/bookings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50"
                                        >
                                            <BriefcaseBusiness className="w-5 h-5" />
                                            <span>Trips</span>
                                        </Link>

                                        {/* Messages */}
                                        <button className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50">
                                            <MessageCircle className="w-5 h-5" />
                                            <span>Messages</span>
                                        </button>

                                        {/* Profile */}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50"
                                        >
                                            <UserCircle className="w-5 h-5" />
                                            <span>Profile</span>
                                        </Link>

                                        <div className="border-t border-gray-200 my-2" />

                                        {/* Notifications */}
                                        <button className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50">
                                            <Bell className="w-5 h-5" />
                                            <span>Notifications</span>
                                        </button>

                                        {/* Account settings */}
                                        <button className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50">
                                            <Settings className="w-5 h-5" />
                                            <span>Account settings</span>
                                        </button>

                                        {/* Language */}
                                        <button className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50">
                                            <Languages className="w-5 h-5" />
                                            <span>Languages & currency</span>
                                        </button>

                                        {/* Help */}
                                        <button className="w-full flex items-center gap-4 text-left px-5 py-3.5 hover:bg-gray-50">
                                            <CircleHelp className="w-5 h-5" />
                                            <span>Help Centre</span>
                                        </button>

                                        <div className="border-t border-gray-200 my-2" />

                                        {/* Become host */}
                                        <button className="w-full text-left px-5 py-3.5 hover:bg-gray-50">
                                            <div className="font-medium">
                                                Become a host
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                It's easy to start hosting and earn extra income.
                                            </div>
                                        </button>

                                        <button className="w-full text-left px-5 py-3.5 hover:bg-gray-50">
                                            Refer a host
                                        </button>

                                        <button className="w-full text-left px-5 py-3.5 hover:bg-gray-50">
                                            Find a co-host
                                        </button>

                                        <div className="border-t border-gray-200 my-2" />

                                        {/* LOGOUT */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 text-left px-5 py-4 hover:bg-gray-50"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Log out</span>
                                        </button>

                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>

                {/* SEARCH BAR */}
                <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${showExpanded
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
        </>
    );
};

export default Header;