// WordPress dependencies
import apiFetch from '@wordpress/api-fetch';

// Internal dependencies
import ScriptData from '../script-data';

// apply nonce to api fetch
apiFetch.use( apiFetch.createNonceMiddleware( ScriptData.getData( 'wp_rest_nonce' ) ) );

/**
 * Shortcode Render
 *
 * @since 1.0.0
 */
class ShortcodeRender {
	static instance;

	constructor() {
		if ( ShortcodeRender.instance ) {
			return ShortcodeRender.instance;
		}

		ShortcodeRender.instance = this;

		this.rendered = {};

		this.requestData = {};
		this.isDoingAjaxRequest = false;
	}

	/**
	 *
	 * @param {string} shortcode
	 * @param {bool} forceUpdate
	 * @param {bool} withMeta Using this option will return an object with 'content' and 'meta' instead of a string.
	 * 						  Check /server/Rest/Route/ShortcodeRenderWithMeta to see which shortcodes will provide
	 * 						  meta data. Example wpv-view will provide the meta data of the View.
	 * @param {null|integer} previewPost ID of a post using for preview of the shortcode
	 * @returns {Promise<any>}
	 */
	render( shortcode, forceUpdate = false, withMeta = false, previewPost = null ) {
		const currentPostId = previewPost || ScriptData.getData( 'current_post_id' );
		// encodeURIComponent works with emojis
		const cacheHash = window.encodeURIComponent( shortcode + ( withMeta ? 1 : 0 ) + currentPostId );

		const route = 'Route/ShortcodeRender';

		let interval = null;

		this.requestData[ cacheHash ] = {
			shortcode,
			with_meta: withMeta ? 1 : 0,
			current_post_id: currentPostId,
		};

		if ( forceUpdate && !! this.rendered[ cacheHash ] ) {
			delete this.rendered[ cacheHash ];
		}

		return new Promise( ( resolve, reject ) => {
			if ( Object.keys( this.rendered ).includes( cacheHash ) ) {
				clearInterval( interval );
				resolve( this.rendered[ cacheHash ] );
				return;
			}

			setTimeout( () => {
				interval = setInterval( () => {
					if ( Object.keys( this.rendered ).includes( cacheHash ) ) {
						clearInterval( interval );
						resolve( this.rendered[ cacheHash ] );
						return;
					}

					if ( this.isDoingAjaxRequest ) {
						return;
					}

					this.isDoingAjaxRequest = true;

					if ( forceUpdate ) {
						// make sure to put it on the requestData list AGAIN
						this.requestData[ cacheHash ] = {
							shortcode,
							with_meta: withMeta ? 1 : 0,
							current_post_id: currentPostId,
						};
					}

					const doRequestFor = this.requestData;
					this.requestData = {};
					// console.error( 'Do Ajax Request for ', doRequestFor );

					apiFetch( {
						path: ScriptData.getData( route ),
						method: 'POST',
						data: doRequestFor,
					} ).then(
						( result ) => {
							setTimeout( () => this.isDoingAjaxRequest = false, 100 );
							Object.keys( result ).forEach( ( key ) => {
								this.rendered[ key ] = result[ key ];
							} );

							// DO NOT RESOLVE HERE
							// the resolve will happen in the next interval
							// if we would apply it here only the latest request would be resolved.
							// because we're doing one request for all shortcodes and one for each shortcode.
						}
					).catch(
						( e ) => {
							setTimeout( () => this.isDoingAjaxRequest = false, 100 );
							reject( e );
						}
					);
				}, 80 );
			}, 250 );
		} );
	}
}

export default new ShortcodeRender();
