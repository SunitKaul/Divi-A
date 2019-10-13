/**
 * Multiple roles fields for edit profile page
 *
 * @since 2.8
 */
var Toolset = Toolset || {};
Toolset.Access = Toolset.Access || {};
Toolset.Access.EditProfile = Toolset.Access.EditProfile || {};

Toolset.Access.EditProfile = function ($) {
	var roles_list = $.parseJSON(taccess_edit_profile_strings.roles);
	var output_html = display_fields = '';
	var help_icon_text = '<i class="js-taccess-tooltip dashicons dashicons-editor-help" data-tooltip="' + taccess_edit_profile_strings.disabled_role_text + '"></i>';

	if (Object.keys(roles_list).length <= 1) {
		output_html = '<p><a href="#show_additional_roles" class="js-taccess-show-additionl-roles">' +
			taccess_edit_profile_strings.more_roles_link_text +
			'</a></p>';
		display_fields = ' style="display:none" ';
	}
	$('select[name="role"]').after(output_html);

	var main_role = $('select[name="role"]').val();
	var role_checked = role_disabled = '';
	var access_multple_roles = '<tr class="acxcess-user-roles-wrap"' + display_fields + '>';
	access_multple_roles += '<th><label>' +
		taccess_edit_profile_strings.additional_roles +
		'</label></th>';
	access_multple_roles += '<td>';

	$.each($('select[name="role"] option'), function (index, value) {
		if ($(value).val() !== '') {
			role_checked = role_disabled = help_icon = '';
			if (typeof roles_list[$(value).val()] !== 'undefined') {
				role_checked = ' checked ';
			}
			if ($(value).val() == main_role) {
				role_disabled = ' class="role_disabled" disabled="disabled" ';
				help_icon = help_icon_text;
			}
			access_multple_roles += '<p><label><input ' + role_disabled + 'value="' + $(value).val() + '" type="checkbox" class="js-access-multiple-roles"' +
				' name="access_multiple_roles[]" ' + role_checked + '> ' + $(value).html() + '</label> ' + help_icon + '</p>';

		}
	});
	access_multple_roles += '<p>' + taccess_edit_profile_strings.multi_roles_notes + '</p>';
	access_multple_roles += '</td>';
	access_multple_roles += '</tr>';

	$('select[name="role"]').closest('tr').after(access_multple_roles);
	$(document).on('change', '#role', function (e) {
		e.preventDefault();
		$('.js-taccess-tooltip').remove();
		$('.role_disabled').removeClass('role_disabled').removeAttr('style').prop('disabled', false).find('input').prop('checked', false);
		$('.js-access-multiple-roles[value="' + $(this).val() + '"]').prop('disabled', true).addClass('role_disabled').closest('label').after(help_icon_text);
	});

	$(document).on('click', '.js-taccess-show-additionl-roles', function (e) {
		$(this).closest('p').remove();
		$('.acxcess-user-roles-wrap').show();

	});


	var AccesschangeTooltipPosition = function (event) {
		var tooltipX = event.pageX + 2;
		var tooltipY = event.pageY + 8;
		$('div.tooltip').css({top: tooltipY, left: tooltipX});
	};

	var AccessshowTooltip = function (event) {
		$('div.tooltip').remove();
		$('<div class="tooltip" style="border:1px solid #ddd;margin: 8px;padding: 8px;background-color: #fff;position: absolute;z-index:  200000;max-width: 200px;">' + $(this).data('tooltip') + '</div>').appendTo('body');
		AccesschangeTooltipPosition(event);
	};

	var AccesshideTooltip = function () {
		$('div.tooltip').remove();
	};

	$(document).on('mousemove', '.js-taccess-tooltip', AccesschangeTooltipPosition);
	$(document).on('mouseenter', '.js-taccess-tooltip', AccessshowTooltip);
	$(document).on('mouseleave', '.js-taccess-tooltip', AccesshideTooltip);
};

jQuery(document).ready(function ($) {
	new Toolset.Access.EditProfile($);
});
