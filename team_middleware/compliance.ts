import * as commons from "../commons/common-compliance";

export function buildComplianceResources() {

    let scopes = [
        {name: 'prod', url: '[Prod](https://app.datadoghq.com/dashboard/jiw-pat-s3x?from_ts=1623183397549&live=true&to_ts=1623186997549)'},
        {name: 'stg', url: '[Stg](https://app.datadoghq.com/dashboard/xse-gcx-dbp/mp-point-integration-apigw?from_ts=1623372577942&live=true&to_ts=1623374377942&tpl_var_scope=stg)'},
        {name: 'dev', url: '[Dev](https://app.datadoghq.com/dashboard/xse-gcx-dbp/mp-point-integration-apigw?from_ts=1623372577942&live=true&to_ts=1623374377942&tpl_var_scope=dev)'},
        {name: 'alpha', url: '[Alpha](https://app.datadoghq.com/dashboard/xse-gcx-dbp/mp-point-integration-apigw?from_ts=1623372577942&live=true&to_ts=1623374377942&tpl_var_scope=alpha)'},
    ];
    
    let apps = [
        {appName: 'Smart Wrapper', appFury: 'smart-pos-wrapper'},
    ]

    commons.buildComplianceResources('mp_point_middleware', scopes, apps);
}