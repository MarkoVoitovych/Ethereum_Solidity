// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete; 
    }

    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;

    modifier restricted () {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    constructor (uint minimum)  {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute () public payable {
        require(msg.value > minimumContribution);

        approvers.push(msg.sender);
    }

    function createRequest (string calldata description , uint value, address recipient) public restricted {
       Request memory newRequest = Request({
        description: description,
        value: value,
        recipient: recipient,
        complete: false
       });

       requests.push(newRequest);
    }

    function approveRequest (Request calldata request) public {
    }
}