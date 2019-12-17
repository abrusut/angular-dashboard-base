import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { SecurityService } from '../services/guards/security.service';

@Directive({
  selector: '[appRoleVerify]'
})
export class RoleVerifyDirective implements OnInit {

  @Input('appRoleVerify') role: string;

  constructor(private el: ElementRef, private securityService: SecurityService) { }

    ngOnInit() {
        if (!this.securityService.hasRole(this.role)) {
            this.el.nativeElement.style.display = 'none';
        }
    }

}
