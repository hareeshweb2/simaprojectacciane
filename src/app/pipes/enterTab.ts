import { Directive, ElementRef, HostListener, Input } from'@angular/core';
@Directive({
    selector: '[onReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() onReturn: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();
            if (e.srcElement.parentNode.nextElementSibling.children[0]) {
                e.srcElement.parentNode.nextElementSibling.children[0].focus();
            }
            else{
                console.log('close keyboard');
            }
            return;
        }

    }

}