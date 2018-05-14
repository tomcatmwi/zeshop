import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class LoginCheck implements CanActivate {

    //  This RouteGuard checks whether the current user is logged in.
    //  If a certain user level is needed, add this to the router declaration:
    //  data: { userLevel: 2 }

    constructor(private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot) {
        if (localStorage.getItem('login') != '1' ) { this._router.navigate(['/login']); }
        if (route.data && route.data['userLevel']) {
            let userLevel = route.data['userLevel'];
            if (userLevel > Number(localStorage.getItem('user.level'))) { 
                this._router.navigate(['/dashboard']);
            }
        }
        return true;
    }
}
