import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //private baseUrl = `https://localhost:9898/api/products`;
  private baseUrl = `${environment.luv2shopApiUrl}/products`;
  private categoryUrl = `${environment.luv2shopApiUrl}/product-category`;
  constructor(private httpClient: HttpClient) {}

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    console.log(searchUrl);
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

      console.log(searchUrl)
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  
  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyWord: string
  ): Observable<GetResponseProducts> {
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}` +
      `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }
  searchProducts(name: String): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${name}`;
    console.log('searchProducts: ', searchUrl);
    return this.getProducts(searchUrl);
  }


  private getProducts(searchUrl: string) {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient
      .get<Product>(productUrl)
      .pipe(map((response) => response));
  }
}
