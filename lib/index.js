var soap = require('soap');
var extend = require('extend');
var path = require('path');

function FedEx(args) {
    var $scope = this;

    // config defaults
    var defaults = {
        key: '',
        password: '',
        account_number: '',
        meter_number: '',
        env: 'test'
    }

    // these are our accessible endpoints
    var endpoints = {
        ship: {
            f:       buildShipmentRequest,
            r:       handleShipmentResponse,
            wsdl:    'ShipService_v21.wsdl',
            version: { ServiceId: 'ship', Major: 21, Intermediate: 0, Minor: 0 }
        }
    }

    // init and set our configs
    $scope.init = function(args) {
        $scope.options = extend(defaults, args);
        return $scope;
    }

    // build out the auth params
    function buildAuthentication(resource) {
        return params = {
            WebAuthenticationDetail: {
                UserCredential: {
                    Key:        $scope.options.key,
                    Password:   $scope.options.password
                }
            },
            ClientDetail: {
                AccountNumber:  $scope.options.account_number,
                MeterNumber:    $scope.options.meter_number
            },
            Version: {
                ServiceId:      resource.version.ServiceId,
                Major:          resource.version.Major,
                Intermediate:   resource.version.Intermediate,
                Minor:          resource.version.Minor
            }
        }
    }

    // build a new shipment request
    function buildShipmentRequest(data, resource, callback) {
        soap.createClient(path.join(__dirname, 'wsdl/'+$scope.options.env, resource.wsdl), function(err, client) {
            if (err) {
                return callback(err, null);
            }

            var params = buildAuthentication(resource);

            params = extend(params, data);

            client.processShipment(params, function(err, result) {
                if (err) {
                    return callback(err, null);
                }

                return callback(null, result);
            });
        });
    }

    // handle shipment request response
    function handleShipmentResponse(res, callback) {
        return callback(null, res);
    }


    // turn our endpoints into accessible functions
    function buildEndpointFunction(fn) {
        return function(data, callback) {
            endpoints[fn].f(data, endpoints[fn], function(err, res) {
                if (err) {
                    return callback(err, null);
                }
                endpoints[fn].r(res, callback);
            });
        }
    }

    for (var fn in endpoints) {
        $scope[fn] = buildEndpointFunction(fn);
    }

    return $scope.init(args);
}

module.exports = FedEx;