import './scss/edit.scss';

import {
	Fragment,
	Component,
} from '@wordpress/element';

import { Toolbar } from '@wordpress/components';

class InvalidWrapper extends Component {
	render() {
		const {
			condition,
			label,
			children,
		} = this.props;

		if ( ! condition ) {
			return <Fragment>{ children }</Fragment>;
		}

		return <div className="wp-block-toolset-blocks-invalid-wrapper">
			<div className={ 'editor-block-list__breadcrumb' }>
				<Toolbar>
					<span className="breadcrumb-label">{ label }</span>
				</Toolbar>
			</div>
			{ children }
		</div>;
	}
}

export default InvalidWrapper;
