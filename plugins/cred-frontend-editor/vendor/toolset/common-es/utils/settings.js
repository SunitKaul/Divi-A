import ScriptData from './script-data';
import apiFetch from '@wordpress/api-fetch';

// apply nonce to api fetch
apiFetch.use( apiFetch.createNonceMiddleware( ScriptData.getData( 'wp_rest_nonce' ) ) );

const route = 'Route/Settings';
const settings = ScriptData.getData( 'settings' );

class Settings {
	get( key ) {
		return settings[ key ];
	}

	persist( key, value ) {
		settings[ key ] = value;
		return new Promise( resolve => {
			apiFetch( {
				path: ScriptData.getData( route ),
				method: 'POST',
				data: { action: 'persist', key, value },
			} ).then(
				( result ) => {
					resolve( result );
				}
			).catch(
			);
		} );
	}
}

export default new Settings();
