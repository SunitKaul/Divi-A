import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';
import { stringify } from 'querystringify';

class ReactSelect extends Component {
	getRestData = ( input ) => {
		if (
			! input ||
			input.length < 2
		) {
			return Promise.resolve( [] );
		}

		// We are replacing the instance of "%25s" with "%s" which ends up there after stringify-ing the placeholder for
		// the search.
		const restPath = this.props.restInfo.base + stringify( this.props.restInfo.args, true ).replace( '%25s', '%s' );

		// @deprecated use wp.apiFetch instead
		this.suggestionsRequest = wp.apiFetch( {
			path: sprintf( restPath, this.sanitizeInput( input ) ),
		} );

		return this.suggestionsRequest
			.then(
				( items ) => {
					const finalItems = items.map( ( item ) => {
						return {
							value: item.id,
							label: item.name,
						};
					} );

					return finalItems;
				},
				( xhr ) => {
					if ( xhr.statusText === 'abort' ) {
						return Promise.resolve( [] );
					}
				}
			)
			.then( ( items ) => {
				return items;
			} );
	};

	sanitizeInput = ( input ) => {
		let output = input
			.replace( /[^\w\s\d]/gi, '' )
			.replace( /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' )
			.split( ' ' )
			.join( '-' );
		if ( '' === output ) {
			output = 'null';
		}
		return output;
	};

	render() {
		const {
			options,
			value,
			placeholder,
			styles,
			isClearable,
			id,
			className,
			onChange,
		} = this.props;

		const ReactSelectComponent = this.props.restInfo ? AsyncSelect : Select;
		const props = {
			value,
			placeholder,
			styles,
			id,
			className,
			isClearable,
			onChange,
		};

		if ( this.props.restInfo ) {
			props.loadOptions = this.getRestData;
		} else {
			props.options = options;
		}

		return <ReactSelectComponent { ...props } />;
	}
}

ReactSelect.defaultProps = {
	options: [],
	value: {},
	placeholder: __( 'Select...', 'wpv-views' ),
	styles: {},
	isClearable: false,
	onChange: () => {
		return null;
	},
	restInfo: null,
};

ReactSelect.propTypes = {
	options: PropTypes.array,
	value: PropTypes.object,
	placeholder: PropTypes.string,
	styles: PropTypes.object,
	isClearable: PropTypes.bool,
	id: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export {
	ReactSelect as ReactSelect,
	AsyncSelect,
};
