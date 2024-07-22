export function bodyParser(body: string |undefined){
  let ParsedBody = {};
  try{
    if (!body) return ParsedBody;
    ParsedBody = JSON.parse(body);
    return ParsedBody;
  }catch{
    return ParsedBody;
  }
}
