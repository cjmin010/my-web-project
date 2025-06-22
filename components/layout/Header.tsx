'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User, LogIn, LogOut, UserPlus, Users, ClipboardList, History, Disc3, Music4, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const { isPlaying, togglePlayPause } = useAudio();
  const router = useRouter();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">MINI 스토어</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/info">회사</Link>
            <Link href="/about">안내</Link>
            <Link href="/qa">Q&A</Link>
            <Link href="/contact">문의</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* 모바일 메뉴 (Sheet) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold">MINI 스토어</span>
                  </Link>
                  <Link href="/info">회사</Link>
                  <Link href="/about">안내</Link>
                  <Link href="/qa">Q&A</Link>
                  <Link href="/contact">문의</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={togglePlayPause}>
              {isPlaying ? <Music4 className="h-6 w-6" /> : <Disc3 className="h-6 w-6" />}
              <span className="sr-only">배경음악 재생/정지</span>
            </Button>

            <Button variant="ghost" size="icon" className="mr-2 relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">장바구니</span>
              </Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                    <span className="sr-only">사용자 메뉴</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}님</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>내 정보</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders">
                      <Package className="mr-2 h-4 w-4" />
                      <span>주문 현황</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>관리자 메뉴</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/registrations">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>회원가입 신청</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users">
                          <Users className="mr-2 h-4 w-4" />
                          <span>사용자 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          <span>상품 관리</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/history">
                          <History className="mr-2 h-4 w-4" />
                          <span>계정 이력</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 