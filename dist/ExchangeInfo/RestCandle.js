"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const Candle_1=require("./Candle");class RestCandle{static fromRest(e){return e.map(e=>new RestCandle(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11]))}toCandle(e,t){return new Candle_1.Candle(new Date(this.openTime),parseFloat(this.open),parseFloat(this.high),parseFloat(this.low),parseFloat(this.close),parseFloat(this.volume),new Date(this.closeTime),e,t)}constructor(e,t,s,i,o,a,l,n,h,r,u,p){this.openTime=e,this.open=t,this.high=s,this.low=i,this.close=o,this.volume=a,this.closeTime=l,this.qaVolume=n,this.numTrades=h,this.takerBuyBAVolume=r,this.takerBuyQAVolume=u,this.ignore=p}}exports.RestCandle=RestCandle;