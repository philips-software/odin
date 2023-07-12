import Singleton from '../../src/container/decorators/singleton.js';
import Secrets from '../../src/container/secrets.js';

@Singleton
class SingletonFixture { }

@Singleton({ domain: 'parent' })
class ParentSingletonFixture { }

@Singleton({ domain: 'parent/child' })
class ChildSingletonFixture { }

@Singleton
class DiscardableSingletonFixture { }
Secrets.setDiscardable(DiscardableSingletonFixture);

@Singleton({ domain: 'parent' })
class ParentDiscardableSingletonFixture { }
Secrets.setDiscardable(ParentDiscardableSingletonFixture);

@Singleton({ domain: 'parent/child' })
class ChildDiscardableSingletonFixture { }
Secrets.setDiscardable(ChildDiscardableSingletonFixture);

export {
  SingletonFixture,
  ChildSingletonFixture,
  ParentSingletonFixture,

  DiscardableSingletonFixture,
  ParentDiscardableSingletonFixture,
  ChildDiscardableSingletonFixture,
};
