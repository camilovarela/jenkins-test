import * as pulumi from "@pulumi/pulumi";
import * as datadog from "@pulumi/datadog";
import { input as inputs } from "@pulumi/datadog/types";
import * as types from "./types";

export function buildComplianceResources(team: string, scopes: types.Scope[], apps: types.App[]) {

    createMonitor(team, scopes, apps);
    createTraceabilityDashboard(team, scopes, apps);
}

function createMonitor(team: string, scopes: types.Scope[], apps: types.App[]) {

    console.log('Creating ' + team + ' Compliance Monitor ::Pulumi');

    let monitorQuery = 'sum(last_5m):';
    let firstExec = true;
    for (let app of apps) {
        if (!firstExec) {
            monitorQuery += ' + ';
        }
        monitorQuery += 'default(sum:http_middleware.traceability.compliance.issue{application:' + app.appFury + ',!destination:services}.as_count(), 0)';
        firstExec = false;
    }
    monitorQuery += ' > 0';

    new datadog.Monitor(team + "_compliance_monitor", {
        name: "Compliance Monitor: " + team + " ::Pulumi",
        type: "metric alert",
        message: "Notify: @point_sdk@mercadolibre.com @camilo.varela@mercadolibre.com.co por favor validar el siguiente [Dashboard](https://app.datadoghq.com/dashboard/hsc-72q-97a/mp-point-integration-outbound-throughput?from_ts=1624557688292&to_ts=1625162488292&live=true)",
        escalationMessage: "",
        query: monitorQuery,
        monitorThresholds: {
            warning: "",
            warningRecovery: "",
            critical: "",
            criticalRecovery: "",
        },
        notifyNoData: false,
        renotifyInterval: 0,
        notifyAudit: false,
        timeoutH: 60,
        includeTags: true,
        tags: [
        ],
    });
}

function createTraceabilityDashboard(team: string, scopes: types.Scope[], apps: types.App[]) {

    new datadog.Dashboard(team + "compliance_dashboard", {
        title: "Compliance Dashboard: " + team + " ::Pulumi",
        description: "Created using Pulumi",
        isReadOnly: true,
        layoutType: "free",
        templateVariables: [
            
        ],
        widgets: buildWidgets(scopes, apps),
    });
}

function buildWidgets(scopes: types.Scope[], apps: types.App[]) {
    
    let widgets : pulumi.Input<pulumi.Input<inputs.DashboardWidget>[]> = [];
    let positionY = 0;

    for (let scope of scopes) {

        widgets.push(addNoteWidget(scope.url, 0, positionY));

        let positionX = 15;
        for (let app of apps) {
            widgets.push(buildWidget(app.appName, app.appFury, scope.name, positionX, positionY));
            positionX += 11;
        }
        positionY += 9;
    }
    return widgets;
}

function addNoteWidget(content: string, positionX: number, positionY: number) {

    let noteWidget : pulumi.Input<inputs.DashboardWidget> = {
        noteDefinition: {
            content: content,
            fontSize: "15",
            textAlign: "center",
            verticalAlign: "center",
            backgroundColor: "blue",
            showTick: true,
        },
        widgetLayout: {
            height: 5,
            width: 8,
            x: positionX + 1,
            y: positionY + 3,
        },
    };
    return noteWidget;
}

function buildWidget(title: string, application: string, scope: string, positionX: number, positionY: number) {

    let widget : pulumi.Input<inputs.DashboardWidget> = {
        queryValueDefinition: {
            title: title,
            titleSize: "12",
            titleAlign: "center",
            textAlign: "center",
            autoscale: true,
            customUnit: "",
            precision: 0,
            requests: [{
                formulas: [
                    {
                        formulaExpression: "default(query1, 0)"
                    }
                ],
                queries: [
                    {
                        metricQuery: {
                            name: "query1",
                            dataSource: "metrics",
                            query: "sum:http_middleware.traceability.compliance.issue{scope:" + scope + ",application:" + application + ",!destination:services}.as_count()",
                            aggregator: "sum"
                        }
                    }
                ],
                conditionalFormats: [
                    {
                        palette: "white_on_red",
                        value: 0,
                        comparator: ">"
                    },
                    {
                        palette: "white_on_green",
                        value: 1,
                        comparator: "<"
                    },
                ]
            }]
        },
        widgetLayout: {
            height: 8,
            width: 10,
            x: positionX,
            y: positionY,
        },
    };
    return widget;
}