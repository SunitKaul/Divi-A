// Wordpress dependencies
import { Component, Fragment } from '@wordpress/element';

// Internal dependencies
import './scss/style.scss';
import { NO_CONTAINER_VALUE, defaults } from './settings';

export default class extends Component {
	normaliseString( string ) {
		if ( typeof string !== 'string' || ! string.trim() ) {
			return '';
		}

		return string;
	}

	render() {
		const { children, data, extraClassString } = this.props;
		const container = { ...defaults, ...data };
		let Tag = container.tag !== NO_CONTAINER_VALUE ? container.tag : false;

		const extraClasses = this.normaliseString( extraClassString );

		// if no container, nut extraClassString is used we use div
		Tag = ! Tag && extraClasses !== '' ? 'div' : Tag;

		if ( ! Tag ) {
			// no container selected
			return (
				<Fragment>
					{ children }
				</Fragment>
			);
		}
		return (
			<Tag data-tb-container={ container.blockId || null } id={ container.id || null }
				className={ `tb-container${ container.cssClasses ? ' ' + container.cssClasses : '' }${ extraClasses ? ' ' + extraClasses : '' }` }
			>
				{ children }
			</Tag>
		);
	}
}
