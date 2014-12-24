'use strict';

angular.module('consultation', ['ui.router', 'bahmni.clinical', 'bahmni.common.config', 'bahmni.common.patient', 'bahmni.common.uiHelper', 'bahmni.common.patientSearch', 'bahmni.common.obs',
    'bahmni.common.domain', 'bahmni.common.conceptSet', 'authentication', 'bahmni.common.appFramework', 'bahmni.adt',
    'httpErrorInterceptor', 'pasvaz.bindonce', 'infinite-scroll', 'bahmni.common.util', 'ngAnimate','ngDialog','angular-gestures']);
angular.module('consultation').config(['$stateProvider', '$httpProvider', '$urlRouterProvider', function ($stateProvider, $httpProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/patient/search');
        var patientSearchBackLink = {label: "<u>P</u>atients", state:"patientsearch", accessKey: "p"};
        $stateProvider     
            .state('patientsearch', {
                url: '/patient/search',
                views: {
                    'content': { 
                        templateUrl: '../common/patient-search/views/patientsList.html',
                        controller : 'PatientsListController'
                    }
                },
                data: {
                    backLinks: [{label: "Home", url: "../home/"}]
                },
                resolve: {
                    initialization: 'initialization'
                }
            })
            .state('patient', {
                url: '/patient/:patientUuid',
                abstract: true,
                data: {
                    backLinks: [patientSearchBackLink]
                },

                views: {
                    'additional-header': { template: '<div ui-view="additional-header"></div>' },
                    'content': { template: '<div ui-view="content"></div><patient-control-panel/>' }
                },
                resolve: {
                    initialization: 'initialization',
                    consultationInitialization: function(initialization, consultationInitialization, $stateParams) {
                    return consultationInitialization($stateParams.patientUuid);
                }}
            })
            .state('patient.dashboard', {
                url: '/dashboard',
                views: {
                    'additional-header': { templateUrl: 'views/dashboardHeader.html' },
                    'content': {
                        templateUrl: 'views/dashboard.html',
                        controller: 'PatientDashboardController'
                    }
                }
            })
            .state('patient.visit', {
                url: '/dashboard/visit/:visitUuid',
                data: {
                    backLinks: [{label: "Dashboard", state: "patient.dashboard"}]
                },
                views: {
                    'additional-header': { templateUrl: 'views/dashboardHeader.html' },
                    'content': {
                        templateUrl: 'views/visit.html',
                        controller: 'VisitController'
                    }
                },
                resolve: {
                    visitInitialization: function(visitInitialization, $stateParams) {
                    return visitInitialization($stateParams.patientUuid, $stateParams.visitUuid);
                }}
            })
            .state('patient.consultation', {
                url: '',
                abstract: true,
                data: {
                    backLinks: [patientSearchBackLink]
                },
                views: {
                    'content': { template: '<ui-view/>' },
                    'additional-header': { templateUrl: 'views/includes/header.html' }
                }
            })
            .state('patient.consultation.visit', {
                url: '/visit/:visitUuid',
                templateUrl: 'views/visit.html',
                controller: 'VisitController',
                resolve: {
                    visitInitialization: function(visitInitialization, $stateParams) {
                    return visitInitialization($stateParams.patientUuid, $stateParams.visitUuid);
                }}
            })
            .state('patient.consultation.summary', {
                url: '/consultation',
                templateUrl: 'views/consultation.html',
                controller: 'ConsultationController'
            })
            .state('patient.consultation.investigation', {
                url: '/investigation',
                templateUrl: 'views/investigations.html',
                controller: 'InvestigationController'
            })
            .state('patient.consultation.diagnosis', {
                url: '/diagnosis',
                templateUrl: 'views/diagnosis.html',
                controller: 'DiagnosisController'
            })
            .state('patient.consultation.treatment', {
                abstract: true,
                templateUrl: 'views/treatment.html'
            })
            .state('patient.consultation.treatment.page', {
                url: '/treatment',
                views: {
                    "addTreatment": {
                        controller: 'TreatmentController',
                        templateUrl: 'views/addTreatment.html',
                        resolve: {
                            treatmentConfig: 'treatmentConfig'
                        }
                    },
                    "viewHistory": {
                        controller: 'DrugOrderHistoryController',
                        templateUrl: 'views/treatmentSections/drugOrderHistory.html',
                        resolve: {
                            prescribedDrugOrders: function(TreatmentService, $stateParams) {
                                return TreatmentService.getPrescribedDrugOrders($stateParams.patientUuid, true, 3);
                            },
                            treatmentConfig: 'treatmentConfig'
                        }
                    }
                }
            })
            .state('patient.consultation.disposition', {
                url: '/disposition',
                templateUrl: 'views/disposition.html',
                controller: 'DispositionController'
            })
            .state('patient.consultation.conceptSet', {
                url: '/concept-set-group/:conceptSetGroupName',
                templateUrl: 'views/conceptSet.html',
                controller: 'ConceptSetPageController'
            })
            .state('patient.consultation.notes', {
                url: '/notes',
                templateUrl: 'views/notes.html'
            })
            .state('patient.consultation.templates', {
                url: '/templates',
                templateUrl: 'views/comingSoon.html'
            })
            .state('patient.consultation.new', {
                url: '/new',
                templateUrl: 'views/patientDashboard.html'
            })
            .state('patient.visitsummaryprint', {
                url: '/latest-prescription-print',
                views: {
                    content: {
                        controller: 'LatestPrescriptionPrintController'
                    }
                }
            });
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
    }]).run(['stateChangeSpinner', function (stateChangeSpinner) {
            FastClick.attach(document.body);
            stateChangeSpinner.activate();
    }]);