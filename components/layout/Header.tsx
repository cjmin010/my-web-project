import Link from 'next/link';
import { ShoppingCart, Menu, Music, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ImageWithFallback from '@/components/ImageWithFallback';
import { useAudio } from '@/context/AudioContext';

const Header = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const { isPlaying, togglePlayPause } = useAudio();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">MINI 스토어</span>
                    </Link>
                    <nav className="flex items-center space-x-1 text-sm font-semibold">
                        <Link href="/info" className="px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-150 transform inline-block">Info</Link>
                        <Link href="/admin/products" className="px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-150 transform inline-block">Shop</Link>
                        <Link href="/about" className="px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-150 transform inline-block">About</Link>
                        <Link href="/contact" className="px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-150 transform inline-block">Contact</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {/* 모바일 메뉴 */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>메뉴</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col space-y-4 mt-4">
                                <Link href="/info" className="transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 transform inline-block origin-left">Info</Link>
                                <Link href="/admin/products" className="transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 transform inline-block origin-left">Shop</Link>
                                <Link href="/about" className="transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 transform inline-block origin-left">About</Link>
                                <Link href="/contact" className="transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 transform inline-block origin-left">Contact</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    {/* 배경음악 컨트롤 버튼 */}
                    <Button variant="outline" size="icon" onClick={togglePlayPause}>
                        {isPlaying ? <Music className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
                        <span className="sr-only">Toggle Music</span>
                    </Button>

                    {/* 장바구니 */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>장바구니</SheetTitle>
                            </SheetHeader>
                            {cart.length === 0 ? (
                                <p className="text-center py-8">장바구니가 비어있습니다.</p>
                            ) : (
                                <div className="mt-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center mb-4">
                                            <div className="flex items-center">
                                                <ImageWithFallback src={item.image} alt={item.name} width={64} height={64} className="rounded-md mr-4" />
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">₩{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                                                <Button variant="ghost" size="icon" className="ml-2" onClick={() => removeFromCart(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>총 금액</span>
                                            <span>₩{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <Button className="w-full mt-4">결제하기</Button>
                                    </div>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header; 