https://gist.github.com/alexspeller/26d540731893141ab520f1c65fb2232e

describe('targetedGreeting', function() {

    it(`should say hello and use the entity's name`, function() {
        let MockedClass:MyComplicatedDomainModel = mock(MyComplicatedDomainModel);
        when(MockedClass.name()).thenReturn('Bobby');

        let bobby = instance(MockedClass);

        expect(targetedGreeting(bobby)).to.equal('Hello, Bobby!');
    });

});
