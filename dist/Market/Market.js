"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Market{static GetLimitsFromBinanceSymbol(t){let e=t.filters,s=Object.assign.apply(Object,e),a={};return a.maxPrice=parseFloat(s.maxPrice),a.minPrice=parseFloat(s.minPrice),a.maxQty=parseFloat(s.maxQty),a.minQty=parseFloat(s.minQty),a.minNotional=parseFloat(s.minNotional),a.stepSize=parseFloat(s.stepSize),a}constructor(t,e,s,a){this.symbol=t,this.baseAsset=e,this.quoteAsset=s,this.limits=a}}exports.Market=Market;