export class Device {
    
    constructor(
        public deviceID: String,
        public loginAttempts: Number,
        public suspended : Boolean
    ) {  }
}
