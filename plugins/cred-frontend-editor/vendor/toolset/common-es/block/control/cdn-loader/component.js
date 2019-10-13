/**
 * CDNjs loader control
 *
 * @since 1.0.0
 */

import {
	Component,
} from '@wordpress/element';

import { __ } from '@wordpress/i18n';

import {
	BaseControl,
} from '@wordpress/components';

import AsyncSelect from 'react-select/async-creatable';

import './scss/edit.scss';

const CDNJS_API_BASE_URL = 'https://api.cdnjs.com/libraries?search=';

/**
 * Displays a combo used for searching CDN assets in CDNjs
 */
export default class extends Component {
	searchCdn( text ) {
		const {
			isCSS,
			isJS,
		} = this.props;

		return new Promise( resolve => {
			window.fetch( CDNJS_API_BASE_URL + text )
				.then( response => response.json() )
				.then( data => {
					const result = data.results
						.filter( item => {
							if ( isCSS ) {
								return !! item.latest.match( /\.css$/ );
							}
							if ( isJS ) {
								return !! item.latest.match( /\.js$/ );
							}
							return true;
						} )
						.map( item => {
							return { label: item.name, value: item.latest };
						} );
					resolve( result );
				} );
		} );
	}

	render() {
		const {
			label,
			onSelectChange,
		} = this.props;

		return (
			<BaseControl
				label={ label || __( 'Load CDN Resource', 'wpv-views' ) }
				className={ 'toolset-blocks-cdn-loader' }
			>
				<AsyncSelect
					cacheOptions
					loadOptions={ this.searchCdn.bind( this ) }
					onChange={ selected => onSelectChange( selected ) }
				/>
			</BaseControl>
		);
	}
}
