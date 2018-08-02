"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EWithdrawlStatus;
(function (EWithdrawlStatus) {
    EWithdrawlStatus[EWithdrawlStatus["emailSent"] = 0] = "emailSent";
    EWithdrawlStatus[EWithdrawlStatus["cancelled"] = 1] = "cancelled";
    EWithdrawlStatus[EWithdrawlStatus["awaitingApproval"] = 2] = "awaitingApproval";
    EWithdrawlStatus[EWithdrawlStatus["rejected"] = 3] = "rejected";
    EWithdrawlStatus[EWithdrawlStatus["processing"] = 4] = "processing";
    EWithdrawlStatus[EWithdrawlStatus["failure"] = 5] = "failure";
    EWithdrawlStatus[EWithdrawlStatus["completed"] = 6] = "completed";
})(EWithdrawlStatus = exports.EWithdrawlStatus || (exports.EWithdrawlStatus = {}));
//# sourceMappingURL=EWithdrawlStatus.js.map