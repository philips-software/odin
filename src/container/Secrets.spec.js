import Secrets from "./Secrets";

export class Nothing { 
  constructor(args) { this.args = args; }
}

export class Singleton extends Nothing { 
  potato = null;
}
Secrets.setSingleton(Singleton);

export class Discardable extends Nothing { 
  onBla() {
    return this.args.cow;
  }
}
Secrets.setSingleton(Discardable);
Secrets.setDiscardable(Discardable);

describe("[ODIN]", function() {
  
  describe('Secrets', () => {
    
    it('should has the right secrets', () => {
      expect(Secrets.isCustom(Nothing)).toBe(false);
      expect(Secrets.isSingleton(Nothing)).toBe(false);
      expect(Secrets.isDiscardable(Nothing)).toBe(false);

      expect(Secrets.isCustom(Singleton)).toBe(false);
      expect(Secrets.isSingleton(Singleton)).toBe(true);
      expect(Secrets.isDiscardable(Singleton)).toBe(false);

      expect(Secrets.isCustom(Discardable)).toBe(false);
      expect(Secrets.isSingleton(Discardable)).toBe(true);
      expect(Secrets.isDiscardable(Discardable)).toBe(true);
    });
    
    
  });
  
});