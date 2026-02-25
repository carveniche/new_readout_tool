export function safeJSONParseArray(str) {
  try {
    return str?.trim() ? JSON.parse(str) : [];
  } catch (e) {
    console.error("Invalid JSON:", e);
    return [];
  }
}

export function safeJSONParseObject(str) {
  if(str.length){
    return JSON.parse(str)
  }else{
    return {}
  }
}