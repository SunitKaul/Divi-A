import { InvalidWrapper } from '../../../index';
import { render, cleanup } from 'react-testing-library';

const setup = ( condition ) => {
	const rendered = render(
		<InvalidWrapper
			condition={ condition }
			label="Test label"
		>
			<p>Child content.</p>
		</InvalidWrapper>
	);
	const wrapper = rendered.queryByText( 'Test label' );
	const child = rendered.getByText( 'Child content.' );

	return { wrapper, child };
};

afterEach( cleanup );

test( 'It only renders child components if condition is not met.', () => {
	const { wrapper, child } = setup( false );

	expect( wrapper ).toBeNull();
	expect( child.textContent ).toBe( 'Child content.' );
} );

test( 'It renders child components wrapped with a warning div and give label if condition is met', () => {
	const { wrapper, child } = setup( true );

	expect( wrapper.textContent ).toBe( 'Test label' );
	expect( child.textContent ).toBe( 'Child content.' );
} );
