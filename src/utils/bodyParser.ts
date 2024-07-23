type IBody = Record<string,any>
export function bodyParser(body: string |undefined):IBody{
  let ParsedBody = {};
  try{
    if (!body) return ParsedBody;
    ParsedBody = JSON.parse(body);
    return ParsedBody;
  }catch{
    return ParsedBody;
  }
}
