import Injectable from '../../src/container/decorators/injectable.js';
import PostConstruct from '../../src/container/decorators/post-construct.js';

@Injectable
class InjectableFixture { }

@Injectable
class InjectableWithPostConstructFixture {
  @PostConstruct
  test(): void {
    return;
  }
}

@Injectable({ domain: 'parent' })
class ParentInjectableFixture { }

@Injectable({ domain: 'parent/child' })
class ChildInjectableFixture { }

export {
  InjectableFixture,
  InjectableWithPostConstructFixture,
  ChildInjectableFixture,
  ParentInjectableFixture,
};
