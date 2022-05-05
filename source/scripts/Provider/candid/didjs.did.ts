// @ts-nocheck
export default ({ IDL }) => {
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    status_code: IDL.Nat16,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  return IDL.Service({
    binding: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    did_to_js: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    subtype: IDL.Func([IDL.Text, IDL.Text], [Result], ['query']),
  });
};

export const init = () => {
  return [];
};
