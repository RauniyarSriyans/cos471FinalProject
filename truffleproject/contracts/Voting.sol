// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Voter {
        bytes32 name;
        string dateOfBirth;
        bytes32 ssn;
        bool hasVoted;
    }

    mapping(bytes32 => Voter) public voters;
    string public electionName;
    string public candidate1;
    string public candidate2;
    string public candidate3;
    uint public candidate1Votes;
    uint public candidate2Votes;
    uint public candidate3Votes;

    event VoterRegistered(
        bytes32 indexed ssn,
        bytes32 name,
        string dateOfBirth
    );

    event VoteCast(
        bytes32 indexed ssn,
        uint indexed optionIndex
    );
    event ElectionEnded(bytes32 indexed electionID);

    function register(
        string memory _name,
        string memory _dateOfBirth,
        string memory _ssn
    ) public {
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        bytes32 hashedSSN = keccak256(abi.encodePacked(_ssn));
        require(
            voters[hashedSSN].ssn != hashedSSN,
            "Voter already registered."
        );
        voters[hashedSSN] = Voter(
            hashedName,
            _dateOfBirth,
            hashedSSN,
            false
        );
        emit VoterRegistered(hashedSSN, hashedName, _dateOfBirth);
    }

    function vote(
        string memory _ssn,
        uint _optionIndex
    ) public {
        bytes32 hashedSSN = keccak256(abi.encodePacked(_ssn));
        require(voters[hashedSSN].ssn == hashedSSN, "Voter not registered.");
        require(!voters[hashedSSN].hasVoted, "Voter has already voted.");
        require(
            _optionIndex == 1 || _optionIndex == 2 || _optionIndex == 3,
            "Invalid candidate."
        );
        voters[hashedSSN].hasVoted = true;
        if(_optionIndex == 1) {
            candidate1Votes++;
        } else if(_optionIndex == 2) {
            candidate2Votes++;
        } else {
            candidate3Votes++;
        }
        emit VoteCast(hashedSSN, _optionIndex);
    }

    function getElectionResults() public view returns (uint, uint, uint) {
        return (candidate1Votes, candidate2Votes, candidate3Votes);
    }

    function getElectionCandidates() public view returns (string memory, string memory, string memory) {
        return (candidate1, candidate2, candidate3);
    }

    function hasRegistered(string memory _ssn) public view returns(bool) {
        bytes32 hashedSSN = keccak256(abi.encodePacked(_ssn));
        return voters[hashedSSN].ssn == hashedSSN;
    }
}
