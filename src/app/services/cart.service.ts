import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if cartItem already in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem;
    //find the item in the cart based on item id
    if (this.cartItems.length > 0) {
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem! != undefined)

    }
    // check if we found it
    if(alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0){
      this.remove(theCartItem)
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id)
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex,1)
      this.computeCartTotals()
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let item of this.cartItems) {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    }

    //publish the new values...all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue)
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity* tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantityValue: ${totalQuantityValue.toFixed(2)}`)
    console.log("----")
  }
}
