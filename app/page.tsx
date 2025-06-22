"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, Search } from "lucide-react";
import ImageWithFallback from '@/components/ImageWithFallback';
import { ProductCarousel } from "@/components/ProductCarousel";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const { products, updateProduct } = useProducts();
  const { addToCart } = useCart();
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      const newRating = Math.min(product.rating + 0.1, 5);
      updateProduct({ ...product, rating: parseFloat(newRating.toFixed(1)), stock: product.stock - 1 });
    }
  };
  
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOrder) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'newest' is default, no specific sort needed if data is pre-sorted by date
        break;
    }
    return result;
  }, [products, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // useSearchParams를 Suspense로 감싸기 위한 내부 컴포넌트 분리
  function SearchParamsEffect() {
    const searchParams = useSearchParams();
    useEffect(() => {
      const productId = searchParams.get('productId');
      if (productId && filteredAndSortedProducts.length > 0) {
        const productIndex = filteredAndSortedProducts.findIndex(p => p.id === Number(productId));
        if (productIndex !== -1) {
          const page = Math.floor(productIndex / productsPerPage) + 1;
          if (currentPage !== page) {
            setCurrentPage(page);
          }
          setTimeout(() => {
            const element = document.getElementById(`product-${productId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // 카드를 잠시 하이라이트합니다.
              element.style.transition = 'box-shadow 0.3s ease-in-out';
              element.style.boxShadow = '0 0 20px 5px rgba(59, 130, 246, 0.7)'; // blue-500
              setTimeout(() => {
                if(element) element.style.boxShadow = '';
              }, 2000);
            }
          }, 200);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, filteredAndSortedProducts]);
    return null;
  }

  return (
    <>
      {/* Suspense로 감싸서 useSearchParams 빌드 오류 방지 */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <SearchParamsEffect />
      </Suspense>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold">New Collection Arrived</h1>
          <p className="mt-4 text-lg md:text-xl">Check out the latest trends</p>
          <Link href="#products">
            <Button className="mt-8">Shop Now</Button>
          </Link>
        </div>
      </section>
      
      {/* Product Carousel */}
      <ProductCarousel />
      
      {/* All Products Section */}
      <section id="products" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="제품을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="price-asc">가격: 낮은 순</SelectItem>
              <SelectItem value="price-desc">가격: 높은 순</SelectItem>
              <SelectItem value="popularity">인기순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paginatedProducts.map((product) => (
            <Card 
              key={product.id} 
              id={`product-${product.id}`} 
              className="overflow-hidden shadow-lg group flex flex-col scroll-mt-24"
            >
              <div className="relative product-card-hover overflow-hidden">
                <div className="relative aspect-square">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.rating >= 4.9 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      인기
                    </div>
                  )}
                   {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Sold Out</span>
                      </div>
                    )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-70 info-overlay flex flex-col justify-center items-center p-4 text-center text-white">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm capitalize">{product.category}</p>
                  <p className="text-xs mt-2 text-gray-300">
                    {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                  </p>
                </div>
              </div>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg h-12 truncate">{product.name}</CardTitle>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-semibold text-gray-800">₩{product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                  ) : (
                    'Sold Out'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-12 space-x-2">
          <Button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            variant="outline"
          >
            이전
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button 
              key={page} 
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? 'default' : 'outline'}
            >
              {page}
            </Button>
          ))}
          <Button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            variant="outline"
          >
            다음
          </Button>
        </div>
      </section>
    </>
  );
} 