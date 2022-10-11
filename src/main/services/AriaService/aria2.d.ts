declare module 'aria2' {
  export default class Aria2 {
    constructor(options: any);
    open(): Promise<void>;
    call(...args: any[]): Promise<any>;
    multicall(...args: any[]): Promise<any>;
  }
}
