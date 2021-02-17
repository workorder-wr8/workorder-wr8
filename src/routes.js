import { Switch, Route } from 'react-router-dom'
import LandingTenant from './Components/LandingTenant/LandingTenant'
import LandingAdmin from './Components/LandingAdmin/LandingAdmin'
import ManageWorkOrder from './Components/ManageWorkOrder/ManageWorkOrder'
import CreateWorkOrder from './Components/CreateWorkOrder/CreateWorkOrder'
import TenantDash from './Components/TenantDash/TenantDash'
import StaffDash from './Components/StaffDash/StaffDash'
import ManagerDash from './Components/ManagerDash/ManagerDash'

export default (
    <Switch>
        <Route exact path='/' component={LandingTenant} />
        <Route path='/admin' component={LandingAdmin} />
        <Route path='/workorder/:id' component={ManageWorkOrder} />
        <Route path='/workorder/new' component={CreateWorkOrder} />
        <Route path='/dash' component={TenantDash} />
        <Route path='/staffdash' component={StaffDash} />
        <Route path='/managerdash' component={ManagerDash} />
    </Switch>
)