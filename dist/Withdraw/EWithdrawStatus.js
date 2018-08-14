"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EWithdrawStatus;
(function (EWithdrawStatus) {
    EWithdrawStatus[EWithdrawStatus["emailSent"] = 0] = "emailSent";
    EWithdrawStatus[EWithdrawStatus["cancelled"] = 1] = "cancelled";
    EWithdrawStatus[EWithdrawStatus["awaitingApproval"] = 2] = "awaitingApproval";
    EWithdrawStatus[EWithdrawStatus["rejected"] = 3] = "rejected";
    EWithdrawStatus[EWithdrawStatus["processing"] = 4] = "processing";
    EWithdrawStatus[EWithdrawStatus["failure"] = 5] = "failure";
    EWithdrawStatus[EWithdrawStatus["completed"] = 6] = "completed";
})(EWithdrawStatus = exports.EWithdrawStatus || (exports.EWithdrawStatus = {}));
//# sourceMappingURL=EWithdrawStatus.js.map