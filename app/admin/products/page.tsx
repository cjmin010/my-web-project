"use client";

import React, { useState, useMemo } from 'react';
import SHA512 from 'crypto-js/sha512';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/data/products';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageWithFallback from '@/components/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

const CORRECT_PASSWORD_HASH = '8be4c982fd89eb03882a5147817559c5503b46e342790753065416171556b60161491764132049e034a747915578c7a65903b482a524128919b47831454e1424';

export default function ProductsAdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(30);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleProductsPerPageChange = (value: string) => {
    setProductsPerPage(Number(value));
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  const handleSaveProduct = (productData: Product | Omit<Product, 'id'>) => {
    if ('id' in productData && productData.id) {
      // 수정
      updateProduct(productData as Product);
    } else {
      // 추가
      addProduct(productData as Omit<Product, 'id'>);
    }
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteRequest = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;

    const hashedInput = SHA512(deletePassword).toString();
    
    if (hashedInput === CORRECT_PASSWORD_HASH) {
      deleteProduct(productToDelete.id);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
    setDeletePassword('');
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="제품명으로 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => { setSelectedProduct(null); setIsDialogOpen(true); }}>
            새 상품 추가
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">번호</TableHead>
              <TableHead>구분</TableHead>
              <TableHead className="w-[100px]">이미지</TableHead>
              <TableHead>제품명</TableHead>
              <TableHead>제품내용</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>별점</TableHead>
              <TableHead>재고</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{(currentPage - 1) * productsPerPage + index + 1}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>
                  <div className="relative w-16 h-16">
                    <ImageWithFallback src={product.image} alt={product.name} fill className="rounded-md object-cover" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                        <span className="text-white font-bold text-xs">Sold Out</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {product.description.length > 20
                    ? `${product.description.substring(0, 20)}...`
                    : product.description}
                </TableCell>
                <TableCell>₩{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.rating.toFixed(1)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => { setSelectedProduct(product); setIsDialogOpen(true); }}>
                    수정
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteRequest(product)}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-2">
            <Label htmlFor="productsPerPage">페이지 당 상품 수:</Label>
            <Select value={String(productsPerPage)} onValueChange={handleProductsPerPageChange}>
                <SelectTrigger className="w-[80px]" id="productsPerPage">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex justify-center items-center space-x-2">
            <Button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                variant="outline"
            >
                이전
            </Button>
            <span className="text-sm">
                {currentPage} / {totalPages}
            </span>
            <Button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                variant="outline"
            >
                다음
            </Button>
        </div>
      </div>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 상품을 삭제하려면 관리자 비밀번호를 입력하세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="col-span-3"
                autoComplete="current-password"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletePassword('')}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// ProductForm Dialog
interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
}

function ProductDialog({ isOpen, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'clothing' as 'clothing' | 'electronics' | 'books',
    rating: 0,
    stock: 10,
  });

  React.useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
          stock: product.stock,
        });
      } else {
        // Reset form for new product
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '',
          category: 'clothing',
          rating: 0,
          stock: 10,
        });
      }
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // When dealing with number inputs, value can be an empty string. Coerce to 0.
    const numericValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({ ...prev, [id]: ['price', 'rating', 'stock'].includes(id) ? numericValue : value }));
  };

  const handleCategoryChange = (value: 'clothing' | 'electronics' | 'books') => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form state with the base64 data URL
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      rating: Number(formData.rating),
      stock: Number(formData.stock),
    };

    if (product?.id) {
        onSave({ ...submissionData, id: product.id });
    } else {
        // For new products, we don't pass an ID.
        onSave(submissionData);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? '상품 수정' : '새 상품 추가'}</DialogTitle>
          <DialogDescription>
            {product ? '상품 정보를 수정합니다.' : '새로운 상품을 추가합니다.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">제품명</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">제품내용</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="col-span-3" 
              maxLength={100} 
              required 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">구분</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">의류</SelectItem>
                <SelectItem value="electronics">전자제품</SelectItem>
                <SelectItem value="books">도서</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">가격</Label>
            <Input id="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">이미지 URL</Label>
            <Input id="image" value={formData.image} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageFile" className="text-right">이미지 업로드</Label>
            <Input id="imageFile" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">별점</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              className="col-span-3"
              step="0.1"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">재고</Label>
            <Input id="stock" type="number" value={formData.stock} onChange={handleChange} className="col-span-3" required />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 