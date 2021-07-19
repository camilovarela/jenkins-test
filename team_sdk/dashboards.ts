
import * as pulumi from "@pulumi/pulumi";
import * as datadog from "@pulumi/datadog";

export function buildAppDashboards() {

    apiIntegrationDashboard();
}

function apiIntegrationDashboard() {

    new datadog.Dashboard("mp_point_sdk_integration_dashboard", {
        title: "MP Point Integration APIGW ::Pulumi",
        description: "Created using Pulumi",
        isReadOnly: true,
        layoutType: "ordered",
        templateVariables: [
            {
                default: "dev",
                name: "scope",
                prefix: "scope"
            },
        ],
        widgets: [
            {
                queryValueDefinition: {
                    title: "Sum all request",
                    textAlign: "center",
                    autoscale: true,
                    customUnit: "",
                    precision: 0,
                    requests: [{
                        queries: [
                            {
                                metricQuery: {
                                    name: "allRequests",
                                    dataSource: "metrics",
                                    query: "sum:point.api.usage{$scope,application:mp-point-integration-apigw,!resource:post_point_int-security-api_authorize}.as_count()",
                                    aggregator: "sum"
                                }
                            }
                        ]
                    }]
                },
            },
            {
                queryValueDefinition: {
                    title: "% success all requests",
                    textAlign: "center",
                    autoscale: false,
                    customUnit: "%",
                    precision: 1,
                    requests: [
                        {
                            formulas: [
                                {
                                    formulaExpression: "100 * (query1 / (query2))"
                                }
                            ],
                            queries: [
                                {
                                    metricQuery: {
                                        dataSource: "metrics",
                                        name: "query1",
                                        query: "sum:point.api.usage{$scope,result:success,application:mp-point-integration-apigw}.as_count()",
                                        aggregator: "sum"
                                    }
                                },
                                {
                                    metricQuery: {
                                        dataSource: "metrics",
                                        name: "query2",
                                        query: "sum:point.api.usage{$scope,application:mp-point-integration-apigw}.as_count()",
                                        aggregator: "sum"
                                    }
                                },
                            ],
                            conditionalFormats: [
                                {
                                    palette: "white_on_red",
                                    value: 80,
                                    comparator: "<"
                                },
                                {
                                    palette: "white_on_yellow",
                                    value: 90,
                                    comparator: "<"
                                },
                                {
                                    palette: "white_on_green",
                                    value: 90,
                                    comparator: ">="
                                },
                            ]
                        },
                    ]
                },
            },
            {
                toplistDefinition: {
                    title: "Top 5 count by error status code",
                    requests: [
                        {
                            formulas: [
                                {
                                    formulaExpression: "query1",
                                    limit: {
                                        count: 10,
                                        order: "desc"
                                    }
                                }
                            ],
                            queries: [
                                {
                                    metricQuery: {
                                        dataSource: "metrics",
                                        name: "query1",
                                        query: "sum:point.api.usage{$scope,application:mp-point-integration-apigw,result:failure} by {status}.as_count()",
                                        aggregator: "sum"
                                    }
                                }
                            ],
                            conditionalFormats: [
                                {
                                    palette: "white_on_yellow",
                                    value: 3,
                                    comparator: "<"
                                },
                                {
                                    palette: "white_on_red",
                                    value: 3,
                                    comparator: ">="
                                },
                            ]
                        }
                    ]
                }
            },
            {
                timeseriesDefinition: {
                    title: "Requests Vs Time",
                    requests: [
                        {
                            formulas: [
                                {
                                    formulaExpression: "successAggregator",
                                    alias: "Success"
                                }
                            ],
                            queries: [
                                {
                                    metricQuery: {
                                        dataSource: "metrics",
                                        name: "successAggregator",
                                        query: "sum:point.api.usage{$scope,application:mp-point-integration-apigw,status:2*,!resource:post_point_int-security-api_authorize}.as_count()",
                                    }
                                }
                            ],
                            displayType: "bars",
                            style: {
                                palette: "dog_classic",
                                lineType: "solid",
                                lineWidth: "normal"
                            }
                        },
                        {
                            formulas: [
                                {
                                    formulaExpression: "errorAggregation",
                                    alias: "Error"
                                }
                            ],
                            queries: [
                                {
                                    metricQuery: {
                                        dataSource: "metrics",
                                        name: "errorAggregation",
                                        query: "sum:point.api.usage{$scope,application:mp-point-integration-apigw,!resource:post_point_int-security-api_authorize,!status:2*}.as_count()",
                                    }
                                }
                            ],
                            displayType: "bars",
                            style: {
                                palette: "warm",
                                lineType: "solid",
                                lineWidth: "normal"
                            }
                        }
                    ]
                }
            }
        ],
    });
}