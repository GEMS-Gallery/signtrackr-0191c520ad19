import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Error "mo:base/Error";

actor {
  type SignatureRequest = {
    id: Nat;
    name: Text;
    notes: ?Text;
    link: Text;
    createdAt: Time.Time;
    signed: Bool;
  };

  stable var nextId: Nat = 0;
  stable var signatureRequests: [SignatureRequest] = [];

  public func addSignatureRequest(name: Text, notes: ?Text, link: Text): async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;

    let newRequest: SignatureRequest = {
      id;
      name;
      notes;
      link;
      createdAt = Time.now();
      signed = false;
    };

    signatureRequests := Array.append(signatureRequests, [newRequest]);
    #ok(id)
  };

  public query func getSignatureRequests(): async [SignatureRequest] {
    signatureRequests
  };

  public func updateSignatureStatus(id: Nat, signed: Bool): async Result.Result<(), Text> {
    let index = Array.indexOf<SignatureRequest>(
      { id; name = ""; notes = null; link = ""; createdAt = 0; signed = false },
      signatureRequests,
      func(a, b) { a.id == b.id }
    );

    switch (index) {
      case null { #err("Signature request not found") };
      case (?i) {
        let updatedRequest = {
          id = signatureRequests[i].id;
          name = signatureRequests[i].name;
          notes = signatureRequests[i].notes;
          link = signatureRequests[i].link;
          createdAt = signatureRequests[i].createdAt;
          signed = signed;
        };
        signatureRequests := Array.tabulate<SignatureRequest>(
          signatureRequests.size(),
          func (j) { if (j == i) updatedRequest else signatureRequests[j] }
        );
        #ok()
      };
    }
  };
}
