import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Voting from "./contracts/Voting.json";

export default function Signup() {
  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <main className="container flex-fill">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card my-5">
              <div className="card-body">
                <h5 className="card-title">Welcome to DeVote</h5>
                <p className="card-text">
                  DeVote is a decentralized voting application built on
                  the Ethereum blockchain.
                </p>
                <a href="/signup" className="btn btn-primary">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-success text-white text-center py-3">
        <p>&copy; 2023 DeVote. All rights reserved.</p>
      </footer>
    </div>
  );
}
