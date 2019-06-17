import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { OrderService } from './order.service';
import { ProfileService } from './profile.service';
import { ChurchService } from './church.service';
import { UserAuthorizationService } from './user-authorization.service';
import { SearchService } from './search.service';
import { AlertService } from './alert.service';
import {WindowScrolling} from './windowScrolling.service';
export const serviceContainer = [
    AuthService, CommonService, OrderService, ProfileService, ChurchService, UserAuthorizationService, SearchService, AlertService,WindowScrolling
]

export { AuthService } from './auth.service';
export { CommonService } from './common.service';
export { OrderService } from './order.service';
export { ProfileService } from './profile.service';
export { ChurchService } from './church.service';
export { UserAuthorizationService } from './user-authorization.service';
export { SearchService } from './search.service';
export { AlertService } from './alert.service';
export {WindowScrolling} from './windowScrolling.service';
