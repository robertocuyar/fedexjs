# NodeJS Wrapper For FedEx API

This node module lets you interact with the FedEx API using WSDL, however it's currently only setup to interface with ShipServices/ProcessShipmentRequest.

Instructions to create additional interfaces have been included below.

## Install

`npm install fedex-nodejs`

## Usage

```js
    var fedexAPI = require('fedex-nodejs');

    var fedex = new fedexAPI({
        account_number: 'ACCOUNT_NUMBER',
        meter_number: 'METER_NUMBER',
        key: 'WEB_SERVICES_KEY',
        password: 'WEB_SERVICES_PASSWORD',
        env: 'test'
    });
```

To move to production, set `env` option to `production`.

### Create a new shipment

```js
    fedex.ship({
        // include your data based on the RequestedShipment complex element (see FedEx Ship Service documentation)
        ShipTimestamp: new Date().toISOString(),
        DropoffType: 'REGULAR_PICKUP',
        ServiceType: 'FEDEX_GROUND',
        PackagingType: 'YOUR_PACKAGING',
        // ...
    }, function(err, res) {

    });
```

## Extending this module

It's relatively simple to extend this module to support additional FedEx API functionality, you can fork this project for your own use and even submit a pull request to support its development.

First check if the relevant WSDL file is included in `/lib/wsdl`.

Secondly you need to create a new endpoint in the `endpoints` object.

```js
    var endpoints = {
        // ...
        yourEndpoint: {
            f:       yourEndpointRequestFunction, // see below
            r:       yourEndpointResponseHandler, // see below
            wsdl:    'ShipService_v21.wsdl', // reference the correct WSDL
            version: { ServiceId: 'FEDEX_SERVICEID', Major: XX, Intermediate: X, Minor: X } // set as per FedEx API
        }
    }
```

Next setup your request and response functions for your new endpoint. For the most part you won't need to alter these functions except to replace `FEDEX_API_FUNCTION` with the appropriate API function.

```js
    function yourEndpointRequestFunction(data, resource, callback) {
        soap.createClient(path.join(__dirname, 'wsdl', resource.wsdl), function(err, client) {
            if (err) {
                return callback(err, null);
            }

            var params = buildAuthentication(resource);

            params = extend(params, data);

            client.FEDEX_API_FUNCTION(params, function(err, result) {
                if (err) {
                    return callback(err, null);
                }

                return callback(null, result);
            });
        });
    }

    function yourEndpointResponseHandler(res, callback) {
        return callback(null, res);
    }
```

That's it, your new endpoint should be accessible via `fedex.yourEndpoint(data, callback)`

## Changelog

### [1.1.0] - 07/14/2018
- Separated test and production WSDL files
- Included new option for switching between test and production