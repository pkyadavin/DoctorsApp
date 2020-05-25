import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[phone]"
})
export class PhoneValidator {
  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent) {
    let e = <KeyboardEvent>event;
    if (
      [8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      e.keyCode != 189
    ) {
      //debugger;
      e.preventDefault();
    }
    //this.validateFields(event);
  }

  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      let numberRegEx = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;  // phone number validation
      if (!numberRegEx.test(this.el.nativeElement.value)) {
        this.el.nativeElement.value = "";
        event.preventDefault();
      }
    }, 100);
  }
}
