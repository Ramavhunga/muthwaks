//var environmentUrl = "https://localhost:44353/";
var environmentUrl = "http://api.muthwaks.co.za";

var DL = {
    sendEmail: function (usermodel) {            
        $.ajax({
            url: environmentUrl + '/api/Common/SendContactEmail',
            type: "POST",
            crossDomain: true,
            data: JSON.stringify(usermodel),
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.Status) {
                    Swal.fire("Message sent", "We've received your message", "success");
                } else {
                    Swal.fire("Not delivered", "Message not received", "error");
                }

                console.log(data);
            },
            error: function (data, status, headers, config) {
                Swal.fire("Oops", "Message not sent, try reaching us through info@muthwaks.co.za", "error");
            }
        });
    },
};

var models = {
    userModel: function () {

        var self = this;

        self.names = ko.observable().extend({ required: true });
        self.email = ko.observable().extend({
            required: true,
            pattern: {
                message: 'Invalid Email',
                params: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            }
        });
        self.contact = ko.observable().extend({
            required: false,
            pattern: {
                message: 'Invalid phone number.',
                params: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
            }
        });
        self.message = ko.observable().extend({ required: true });
        self.package = ko.observable();
        self.errors = ko.observable();
        self.robotcheck = ko.observable();
        self.is_valid = ko.computed(function () {
            var errors = ko.validation.group(self, { deep: true });
            console.log(errors());
            self.errors(errors().length);

        });
        self.submitform = function (data, event) {
            if (self.errors() === 0 && usermodel.robotcheck()) {
                DL.sendEmail(ko.toJS(self));
            } else {
                Swal.fire("Input requirements", "Please fill all text marked in red", "error");

            }
        };

        return self;
    }
};

function onSubmit() {

    usermodel.robotcheck(true);
    
}
function selectedpackage(data) { 
    usermodel.package(data);
}
var usermodel = null;
(function () {

    usermodel = ko.mapping.fromJS(models.userModel());
    ko.attach("usermodel", usermodel);
})();
