import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { GetResponseProducts } from '../../services/product.service';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = NaN;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      console.log("Category id:", this.currentCategoryId)
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //if we have diff category id than previous
    //then set thepageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}, thePageSize=${this.thePageSize}, theTotalElements=${this.theTotalElements}`)
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
    // now get the products for the given category id
    // this.productService
    //   .getProductList(this.currentCategoryId)
    //   .subscribe((data) => {
    //     this.products = data;
    //   });
  }

  processResult() {
    return (data: GetResponseProducts) => {
      console.log("GetResponseProducts DATA:",data)
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  updatePageSize(event: any) {
    const size = event.target.value;
    this.thePageSize = size;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(tempProduct: Product) {
    console.log("product added:", tempProduct)

    const theCartItem = new CartItem(tempProduct);
    this.cartService.addToCart(theCartItem);
  }
}
