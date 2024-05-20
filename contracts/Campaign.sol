// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    // Structure to store the details of a funding request
    struct Request {
        string description; // Description of the request
        uint value; // Amount requested
        address payable recipient; // Address of the recipient
        bool complete; // Completion status of the request
        uint approvalCount; // Number of approvals
        mapping (address => bool) approvals; // Mapping of approvals
    }

    address public manager; // Address of the campaign manager
    uint public minimumContribution; // Minimum contribution required to become an approver
    mapping (address => bool) public approvers; // Mapping of addresses that have contributed
    Request[] public requests; // Array of funding requests
    uint public approversCount; // Number of contributors

    // Modifier to restrict function access to the manager
    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    // Constructor to initialize the contract
    constructor(uint minimum) {
        manager = msg.sender; // Set the manager's address
        minimumContribution = minimum; // Set the minimum contribution
    }

    // Function to contribute to the campaign
    function contribute() public payable {
        require(msg.value >= minimumContribution, "Minimum contribution not met");

        // Add the contributor to the mapping if they haven't contributed before
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    // Function to create a new funding request (restricted to manager)
    function createRequest(string calldata description, uint value, address payable recipient) public restricted {
        // Create a new request and add it to the requests array
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    // Function to approve a funding request
    function approveRequest(uint index) public {
        Request storage currentRequest = requests[index];

        require(approvers[msg.sender], "You are not a contributor"); // Check if the sender is an approver
        require(!currentRequest.approvals[msg.sender], "Already approved"); // Check if the sender has not already approved

        currentRequest.approvals[msg.sender] = true; // Mark the sender's approval
        currentRequest.approvalCount++; // Increment the approval count
    }

    // Function to finalize a funding request (restricted to manager)
    function finalizeRequest(uint index) public restricted {
        Request storage currentRequest = requests[index];

        require(!currentRequest.complete, "Request is already completed"); // Check if the request is not already completed
        require(currentRequest.approvalCount > (approversCount / 2), "Need more approvals"); // Check if the request has enough approvals
        require(address(this).balance >= currentRequest.value, "Not enough ETH"); // Check if the contract has enough balance

        currentRequest.complete = true; // Mark the request as complete
        currentRequest.recipient.transfer(currentRequest.value); // Transfer the requested amount to the recipient
    }
}
