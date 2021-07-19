import * as sdk_compliance from "./team_sdk/compliance";
import * as sdk_dashboards from "./team_sdk/dashboards";

import * as middleare_dashboards from "./team_middleware/compliance";

sdk_compliance.buildComplianceResources();
sdk_dashboards.buildAppDashboards();

middleare_dashboards.buildComplianceResources();