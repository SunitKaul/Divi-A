<div class="ddl-dialogs-container"> <!-- The create a new layout popup -->

	<div class="ddl-dialog wp-core-ui" id="ddl-accordion-edit">
		<div class="ddl-dialog-header">
			<h2 class="js-dialog-edit-title"><?php _e('Edit accordion', 'ddl-layouts'); ?></h2>
			<i class="fa fa-remove icon-remove js-edit-dialog-close"></i>
		</div>

		<div class="ddl-dialog-content">

			<?php $unique_id = uniqid(); ?>
			<div class="js-popup-accordion">
				
				<div class="ddl-dialog-content-main ddl-popup-tab" id="js-tab-content-<?php echo $unique_id; ?>">
					<input type="hidden" name="ddl-layout-edit-accordion-name" id="ddl-layout-edit-accordion-name">
					<p>
							<a class="fieldset-inputs" href="<?php echo WPDLL_ACCORDION_CELL_HELP; ?>" target="_blank">
								<?php _e('Working with accordion', 'ddl-layouts'); ?> &raquo;
							</a>
						</p>
				</div> <!-- .ddl-popup-tab -->
				<?php do_action('ddl-before_container_markup_controls'); ?>
				<div class="ddl-popup-tab ddl-markup-controls" id="js-grid-settings-<?php echo $unique_id; ?>">
					<?php
						$dialog_type = 'container';
						do_action('ddl-before_container_default_edit_fields');
						include 'cell_display_settings_tab.tpl.php';
						do_action('ddl-after_container_default_edit_fields');
					?>
				</div> <!-- .ddl-popup-tab -->

			</div> <!-- .js-popup-accordion -->

		</div>

		<div class="ddl-dialog-footer">
			<?php wp_nonce_field('wp_nonce_edit_css', 'wp_nonce_edit_css'); ?>
			<button class="button js-edit-dialog-close"><?php _e('Cancel','ddl-layouts') ?></button>
			<button data-close="yes" class="button button-primary js-accordion-dialog-edit-save"><?php _e('Apply','ddl-layouts') ?></button>
		</div>

	</div> <!-- .ddl-dialog -->

</div>