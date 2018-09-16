import {EMethod} from "../../../Rest/EMethod";

export interface IBaseHandleException{
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;
	killAllWorkers?: boolean;
	killWorker?: boolean;
	killMaster?: boolean;
}


