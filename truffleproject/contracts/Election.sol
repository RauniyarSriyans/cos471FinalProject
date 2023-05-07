// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Voter {
        bytes32 name;
        string dateOfBirth;
        bytes32 ssn;
        address addr;
        bool hasVoted;
    }

    struct electionA {
        string name;
        string[] candidates;
        mapping(uint => uint) voteCounts;
        bool active;
    }

    mapping(bytes32 => Voter) public voters;
    mapping(bytes32 => electionA) public elections;

    event VoterRegistered(bytes32 indexed ssn, bytes32 name, string dateOfBirth);
    event VoteCast(bytes32 indexed ssn, bytes32 indexed electionID, uint indexed optionIndex);
    event ElectionCreated(bytes32 indexed electionID, string name, string[] options);
    event ElectionEnded(bytes32 indexed electionID);

    function register(string memory _name, string memory _dateOfBirth, string memory _ssn, address addr) public {
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        bytes32 hashedSSN = keccak256(abi.encodePacked(_ssn));
        require(voters[hashedSSN].ssn != hashedSSN, "Voter already registered.");
        voters[hashedSSN] = Voter(hashedName, _dateOfBirth, hashedSSN, addr, false);
        emit VoterRegistered(hashedSSN, hashedName, _dateOfBirth);
    }

    function vote(string memory _ssn, bytes32 _electionID, uint _optionIndex) public {
        bytes32 hashedSSN = keccak256(abi.encodePacked(_ssn));
        require(voters[hashedSSN].ssn == hashedSSN, "Voter not registered.");
        require(!voters[hashedSSN].hasVoted, "Voter has already voted.");
        require(elections[_electionID].active, "Election is not active.");
        require(_optionIndex < elections[_electionID].candidates.length, "Invalid option index.");
        voters[hashedSSN].hasVoted = true;
        elections[_electionID].voteCounts[_optionIndex]++;
        emit VoteCast(hashedSSN, _electionID, _optionIndex);
    }

    function createElection(string memory _name, string[] memory _options) public returns (bytes32) {
        bytes32 electionID = keccak256(abi.encodePacked(_name, block.timestamp));
        require(!elections[electionID].active, "Election already exists.");
        electionA storage newElection = elections[electionID]; 
        newElection.name = _name;
        newElection.candidates = _options;
        for (uint i = 0; i < _options.length; i++) {
            newElection.voteCounts[i] = 0;
        }
        newElection.active = true;
        emit ElectionCreated(electionID, _name, _options);
        return electionID;
    }

    function endElection(bytes32 _electionID) public {
        require(elections[_electionID].active, "Election is not active.");
        elections[_electionID].active = false;
        emit ElectionEnded(_electionID);
    }

    function getElectionResults(bytes32 _electionID) public view returns (uint[] memory) {
        require(!elections[_electionID].active, "Election is still active.");
        uint[] memory results = new uint[](elections[_electionID].candidates.length);
        for (uint i = 0; i < elections[_electionID].candidates.length; i++) {
            results[i] = elections[_electionID].voteCounts[i];
        }
        return results;
    }
}