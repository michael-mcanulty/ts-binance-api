"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const Balance_1=require("../Balances/Balance");class OutboundAccountInfo{static fromBinanceRest(e){let t=e.balances.map(e=>new Balance_1.Balance(e.asset,e.free,e.locked));return new OutboundAccountInfo(t,e.buyerCommissionRate,e.canDeposit,e.canTrade,e.canWithdraw,e.eventTime,e.lastAccountUpdate,e.makerCommissionRate,e.sellerCommissionRate,e.takerCommissionRate)}static fromBinanceStream(e){let t,n=e.B.map(e=>new Balance_1.Balance(e.a,e.f,e.l));return t=new OutboundAccountInfo(n,e.b,e.D,e.T,e.W,e.E,e.u,e.m,e.s,e.t)}constructor(e,t,n,a,s,o,c,i,r,u){this.balances=e,this.buyerCommissionRate=t,this.canDeposit=n,this.canTrade=a,this.canWithdraw=s,this.eventType="account",this.eventTime=o,this.lastAccountUpdate=c,this.makerCommissionRate=i,this.sellerCommissionRate=r,this.takerCommissionRate=u}}exports.OutboundAccountInfo=OutboundAccountInfo;