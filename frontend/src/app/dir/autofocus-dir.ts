import { AfterContentInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective implements AfterContentInit {
  private el = inject(ElementRef);

  public ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 200);
  }
}
