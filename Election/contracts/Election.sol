pragma solidity >=0.4.22 <0.7.0;

contract Election {
    // A candidate struct 
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // a mapping of Candidate structs 
    mapping(uint => Candidate) public candidates;

    // number of candidates
    uint public candidatesCount;

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        Candidate memory newCand = Candidate(candidatesCount, _name, 0);
        candidates[candidatesCount] = newCand;
    }
}
