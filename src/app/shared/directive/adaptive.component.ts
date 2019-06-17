import {
	Directive,
	Input,
	OnInit,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	NgZone
} from "@angular/core";
// rxjs
import { Subject } from "rxjs/Subject";
import { AlertService } from "../../services";
import { ErrorMessages } from '../../messages';
@Directive({
	selector: "[layout]"
})
export class AdaptiveDirective implements OnInit, OnDestroy {
	@Input("layout") layout: string;

	private media$ = new Subject();

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private zone: NgZone , private alertService: AlertService
	) {
		// window.addEventListener('resize', this.handleMediaChange);
	}

	ngOnInit() {
		this.media$.subscribe(query => {
			this.viewContainer.detach();

			if (this.layout === query) {
				this.zone.run(() => {
					this.viewContainer.createEmbeddedView(this.templateRef);
				});
			}
		},(error)=>{
			this.alertService.error(ErrorMessages.observableError, true);
		  });

		this.handleMediaChange()
	}

	ngOnDestroy() {
		// window.removeEventListener('resize', this.handleMediaChange);
	}

	handleMediaChange = () => {
		if ((/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))) {
			this.media$.next("mobile");
		} else {
			this.media$.next("desktop");
		}
	}
}
