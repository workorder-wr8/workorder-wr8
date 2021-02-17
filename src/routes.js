import { Switch, Route } from 'react-router-dom'
import AdminDash from './Components/AdminDash/AdminDash'
import CreateWorkOrder from './Components/CreateWorkOrder/CreateWorkOrder'
import Landing from './Components/Landing/Landing'
import Register from './Components/Register/Register'
import TenantDash from './Components/TenantDash/TenantDash'
import WorkOrderAdmin from './Components/AdminDash/AdminDash'
import WorkOrderTenant from './Components/WorkOrderTenant/WorkOrderTenant'

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/register' component={Register} />
        <Route path='/admindash' component={AdminDash} />
        <Route path='/createworkorder' component={CreateWorkOrder} />
        <Route path='/tenantdash' component={TenantDash} />
        <Route path='/workorderadmin' component={WorkOrderAdmin} />
        <Route path='/workordertenant' component={WorkOrderTenant} />
    </Switch>
)