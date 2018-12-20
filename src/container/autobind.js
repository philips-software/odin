const VALIDS = ['action', 'state']; //sad, sooooo sad </3

function isValid(name) {
  return (name.startsWith('on') || VALIDS.indexOf(name) > -1);
}

export default function autobind(instance, proto) {
  const protoToCheck = proto || Object.getPrototypeOf(instance);
  
  if (protoToCheck === Object.prototype) {
    return;
  }
  
  let propertyNames = Object.getOwnPropertyNames(protoToCheck);
  propertyNames = propertyNames.filter(isValid);
  for (let name of propertyNames) {   
    const value = instance[name];
    
    if (typeof value === 'function') {
      instance[name] = instance[name].bind(instance);
    }
  }
  autobind(instance, Object.getPrototypeOf(protoToCheck));
}