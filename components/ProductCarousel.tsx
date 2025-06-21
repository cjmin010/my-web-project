"use client"

import * as React from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ImageWithFallback from "@/components/ImageWithFallback"
import { useProducts } from "@/context/ProductContext"

export function ProductCarousel() {
  const { products } = useProducts()

  const topProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // 무한 슬라이드를 위해 상품 목록을 복제합니다.
  const duplicatedProducts = [...topProducts, ...topProducts];

  // 상품 개수에 따라 애니메이션 길이를 동적으로 조절합니다 (상품당 3초).
  const animationDuration = `${topProducts.length * 3}s`;

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">인기 상품</h2>
      <div
        className="w-full overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
      >
        <div
          className="flex w-max animate-[scroll_var(--duration)_linear_infinite] hover:[animation-play-state:paused]"
          style={{ '--duration': animationDuration } as React.CSSProperties}
        >
          {duplicatedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="w-[200px] flex-shrink-0 px-2">
              <Link href={`/?productId=${product.id}`}>
                <div className="p-1 cursor-pointer group">
                  <Card className="overflow-hidden">
                    <CardContent className="relative flex aspect-square items-center justify-center">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs">₩{product.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs">{product.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-2 text-center">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 