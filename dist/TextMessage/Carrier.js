"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Carrier {
    constructor(carrier, domain) {
        this.carrier = carrier.toLowerCase();
        this.domain = domain.toLowerCase();
    }
    static GetEmailAddress(carrier, phoneNumber) {
        if (!carrier) {
            return null;
        }
        let matchCarrier = Carrier.USCarriers.filter(d => { return (d.carrier === carrier.toLowerCase()); });
        if (!phoneNumber || !matchCarrier || matchCarrier.length === 0) {
            return null;
        }
        return `${phoneNumber}@${matchCarrier[0].domain}`;
    }
}
Carrier.USCarriers = [{ "carrier": "att", "domain": "txt.att.net" }, { "carrier": "tmobile", "domain": "tmomail.net" }, { "carrier": "verizon", "domain": "vtext.com" }, { "carrier": "cricket", "domain": "sms.mycricket.com" }, { "carrier": "uscellular", "domain": "email.uscc.net" }, { "carrier": "virginmobile", "domain": "vmobl.com" }, { "carrier": "boostmobile", "domain": "myboostmobile.com" }, { "carrier": "metropcs", "domain": "mymetropcs.com" }];
exports.Carrier = Carrier;
//# sourceMappingURL=Carrier.js.map