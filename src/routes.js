import { Switch, Route } from 'react-router-dom'
import LandingTenant from './Components/LandingTenant/LandingTenant'
import LandingAdmin from './Components/LandingAdmin/LandingAdmin'
import ManageWorkOrder from './Components/ManageWorkOrder/ManageWorkOrder'
import CreateWorkOrder from './Components/CreateWorkOrder/CreateWorkOrder'
import TenantDash from './Components/TenantDash/TenantDash'
import StaffDash from './Components/StaffDash/StaffDash'
import ManagerDash from './Components/ManagerDash/ManagerDash'
import LandlordDash from './Components/LandlordDash/LandlordDash'
import LandlordProperty from './Components/LandlordProperty/LandlordProperty'

export default (

    <Switch>
        <Route exact path='/' component={LandingTenant} />
        <Route path='/admin' component={LandingAdmin} />
        <Route path='/create/workorder' component={CreateWorkOrder} />
        <Route path='/dash' component={TenantDash} />
        <Route path='/staffdash' component={StaffDash} />
        <Route path='/landlorddash' component={LandlordDash} />
        <Route path='/landlord/property/:id' component={LandlordProperty} />
        <Route path='/managerdash' component={ManagerDash} />
       
    </Switch>
)