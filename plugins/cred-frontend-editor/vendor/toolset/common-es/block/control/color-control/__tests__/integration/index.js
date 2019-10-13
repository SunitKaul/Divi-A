import { ColorControl } from '../../../index';
import { render, cleanup } from 'react-testing-library';

test( 'A color control is rendered with given props', () => {
	const rendered = render(
		<ColorControl
			id={ 'id' }
			label={ 'Colors' }
			color={ 'green' }
			onChange={ () => {} }
			themeColors={ [] }
		/>
	);
	const label = rendered.getByText( 'Colors' );

	expect( label.textContent ).toBe( 'Colors' );

	cleanup();
} );
