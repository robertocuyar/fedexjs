var fedexAPI = require('../lib/index.js');

var fedex = new fedexAPI({
    account_number: '510087780',
    meter_number: '119233823',
    key: '  WdO6uydPOQ9U5LxW',
    password: 'nmDZwmmAzg2wXq66utbNG7PFf',
    env: 'test'
});

var date = new Date();
fedex.ship({
    RequestedShipment: {
        ShipTimestamp: new Date(date.getTime() + (24*60*60*1000)).toISOString(),
        DropoffType: 'REGULAR_PICKUP',
        ServiceType: 'FEDEX_GROUND',
        PackagingType: 'YOUR_PACKAGING',
        Shipper: {
            Contact: {
                PersonName: 'Sender Name',
                CompanyName: 'Company Name',
                PhoneNumber: '5555555555'
            },
            Address: {
                StreetLines: [
                    'Address Line 1'
                ],
                City: 'Collierville',
                StateOrProvinceCode: 'TN',
                PostalCode: '38017',
                CountryCode: 'US'
            }
        },
        Recipient: {
            Contact: {
                PersonName: 'Recipient Name',
                CompanyName: 'Company Receipt Name',
                PhoneNumber: '5555555555'
            },
            Address: {
                StreetLines: [
                    'Address Line 1'
                ],
                City: 'Charlotte',
                StateOrProvinceCode: 'NC',
                PostalCode: '28202',
                CountryCode: 'US',
                Residential: false
            }
        },
        ShippingChargesPayment: {
            PaymentType: 'SENDER',
            Payor: {
                ResponsibleParty: {
                    AccountNumber: fedex.options.account_number
                }
            }
        },
        LabelSpecification: {
            LabelFormatType: 'COMMON2D',
            ImageType: 'PDF',
            LabelStockType: 'PAPER_4X6'
        },
        PackageCount: '1',
        RequestedPackageLineItems: [{
            SequenceNumber: 1,
            GroupPackageCount: 1,
            Weight: {
                Units: 'LB',
                Value: '50.0'
            },
            Dimensions: {
                Length: 108,
                Width: 5,
                Height: 5,
                Units: 'IN'
            }
        }]
    }
}, function(err, res) {
    if (err) {
        console.log(err);
    }

    console.log("Response:");
    console.log(res);
});