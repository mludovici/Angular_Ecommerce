import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

	// whitespace validation
	static notOnlyWhitespace(control: FormControl): ValidationErrors {
		//check if string only contains whitespace
		return (control.value != null) && (control.value.trim().length === 0) ? { 'notOnlyWhitespace': true} : null;
	}
}
