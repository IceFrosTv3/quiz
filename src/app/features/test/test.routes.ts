import {Routes} from '@angular/router';
import {ChoiceComponent} from './choice/choice.component';
import TestComponent from './test/test.component';
import {ResultComponent} from './result/result.component';
import {ResultDetailsComponent} from './result-details/result-details.component';


export const TEST_ROUTES: Routes = [
  {path: 'choice', component: ChoiceComponent},
  {path: 'test/:id', component: TestComponent},
  {path: 'result', component: ResultComponent},
  {path: 'result-details/:id', component: ResultDetailsComponent},
]
