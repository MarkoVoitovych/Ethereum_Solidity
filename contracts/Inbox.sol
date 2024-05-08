pragma solidity ^0.4.17;

contract Inbox {
    string public message;
    
    constructor (string memory initialMessage) internal {
        message = initialMessage;
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}