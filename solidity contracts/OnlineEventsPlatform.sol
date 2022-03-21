// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract OnlineEventsPlatform {
    uint private count = 0;
    uint private lastId = 0;
    address public owner;

    uint[] private eventsIdArray;

    constructor() {  
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    struct EventUri{
        string infoUri;
        uint256 createdAt;
    }

    mapping(uint => EventUri) private EventsMap;

    function getCount() public view returns (uint returnedCount){
        returnedCount = count;
    }

    function getEventByPosition(uint position) public view returns(EventUri memory uri){
        require(position > 0);
        require(position <= eventsIdArray.length, "Event with such position does not exist");
        uri = EventsMap[eventsIdArray[position-1]];
    }

    function deleteEventByPosition(uint position) public onlyOwner{
        require(position > 0);
        require(position <= eventsIdArray.length, "Event with such position does not exist");
        delete EventsMap[eventsIdArray[position-1]];
        count = count - 1;
        eventsIdArray[position-1] = eventsIdArray[eventsIdArray.length-1];
        eventsIdArray.pop();
    }

    function editEventByPosition(uint position, string memory newInfoUri) public onlyOwner{
        require(position > 0);
        require(position <= eventsIdArray.length, "Event with such position does not exist");
        EventsMap[eventsIdArray[position-1]].infoUri = newInfoUri;
    }


    function addEvent(string memory infoUri) public onlyOwner{
        count = count + 1;
        lastId = lastId + 1;
        eventsIdArray.push(lastId);
        EventsMap[lastId].infoUri = infoUri;
        EventsMap[lastId].createdAt = block.timestamp;
    }
}