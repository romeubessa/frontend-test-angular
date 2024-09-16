export interface HourlySummary {
    hour: string;
    totalEntries: number;
    totalExits: number;
}
  
export class HourlySummary implements HourlySummary {
    constructor(
        public hour: string,
        public totalEntries: number,
        public totalExits: number
    ) { }
}