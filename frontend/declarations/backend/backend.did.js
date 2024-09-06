export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Time = IDL.Int;
  const SignatureRequest = IDL.Record({
    'id' : IDL.Nat,
    'link' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'notes' : IDL.Opt(IDL.Text),
    'signed' : IDL.Bool,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addSignatureRequest' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_1],
        [],
      ),
    'getSignatureRequests' : IDL.Func(
        [],
        [IDL.Vec(SignatureRequest)],
        ['query'],
      ),
    'updateSignatureStatus' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
