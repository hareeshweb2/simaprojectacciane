import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AdaptiveDirective } from './directive/adaptive.component';
import { ImageCropperComponent } from 'ngx-img-cropper';


@NgModule({
    imports: [ CommonModule ],
    declarations: [ AdaptiveDirective, ImageCropperComponent ],
    exports: [ AdaptiveDirective, ImageCropperComponent ]
})
export class SharedModule { }