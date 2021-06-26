export default class Messages{
    constructor(name, creator){
        this._id = Task.incrementId();
        this.name = name;
        this.creator = creator;
    }
    static setLatestId(id){
        this.latestId = id;
    }
    static incrementId(){
        if(!this.latestId){
            this.latestId = 1;
        }
        else{
            this.latestId++;
        }
        return this.latestId;
    }
}