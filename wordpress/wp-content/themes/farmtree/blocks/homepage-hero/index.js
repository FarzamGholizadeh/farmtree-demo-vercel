(function () {
  var attempts = 0;

  function boot() {
    var wp = window.wp;

    attempts += 1;

    if (!wp || !wp.hooks || !wp.compose || !wp.element || !wp.blockEditor || !wp.components || !wp.i18n) {
      if (attempts < 80) {
        window.setTimeout(boot, 50);
      }

      return;
    }

    var addFilter = wp.hooks.addFilter;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var __ = wp.i18n.__;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var RichText = wp.blockEditor.RichText;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;
    var Notice = wp.components.Notice;

    var defaults = {
      kicker: 'AGROFORESTRY INTELLIGENCE',
      title: 'Make agroforestry measurable, investable and scalable.',
      text: 'FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions.',
      mediaUrl: '',
      mediaAlt: 'Agroforestry landscape planning — tree-based farming systems and landscape investment in Madagascar',
      primaryText: 'Request a demo ↗',
      primaryUrl: 'https://tool.farmtree.earth/Identity/Account/Register',
      secondaryText: 'Ask for a quotation ↗',
      futureLabel: 'Future service',
      futureTitle: 'Design your own agroforestry system',
      futureText: 'Explore how FarmTree turns agroforestry scenarios into measurable outcomes and investment-ready plans.',
      showFutureCard: true
    };

    function attr(attributes, key) {
      return attributes[key] === undefined || attributes[key] === '' ? defaults[key] : attributes[key];
    }

    function stripTags(value) {
      return String(value || '').replace(/<[^>]*>/g, '');
    }

    function setTextAttribute(setAttributes, key, value) {
      var next = {};
      next[key] = stripTags(value);
      setAttributes(next);
    }

    function isHttpsUrl(value) {
      return /^https:\/\//i.test(String(value || '').trim());
    }

    function textControl(label, key, attributes, setAttributes, help) {
      return el(TextControl, {
        label: label,
        value: attr(attributes, key),
        help: help || '',
        onChange: function (value) {
          setTextAttribute(setAttributes, key, value);
        }
      });
    }

    function richText(tagName, className, label, key, attributes, setAttributes) {
      return el(RichText, {
        tagName: tagName,
        className: className,
        value: attr(attributes, key),
        allowedFormats: [],
        'aria-label': label,
        placeholder: label,
        onChange: function (value) {
          setTextAttribute(setAttributes, key, value);
        }
      });
    }

    function renderMediaControl(attributes, setAttributes, mediaUrl) {
      if (!MediaUpload || !MediaUploadCheck) {
        return el(Notice, { status: 'warning', isDismissible: false },
          __('The WordPress media picker is unavailable in this editor session.', 'farmtree')
        );
      }

      return el(MediaUploadCheck, {},
        el(MediaUpload, {
          allowedTypes: ['image'],
          value: attributes.mediaId || 0,
          onSelect: function (media) {
            setAttributes({
              mediaId: media.id || 0,
              mediaUrl: media.url || '',
              mediaAlt: media.alt || attr(attributes, 'mediaAlt')
            });
          },
          render: function (obj) {
            return el(Button, { variant: 'secondary', onClick: obj.open },
              mediaUrl ? __('Replace image', 'farmtree') : __('Choose image', 'farmtree')
            );
          }
        })
      );
    }

    function HomepageHeroEdit(props) {
      var attributes = props.attributes || {};
      var setAttributes = props.setAttributes;
      var mediaUrl = attr(attributes, 'mediaUrl') || (window.FT_ASSETS ? window.FT_ASSETS + '/case-giz_opt.webp' : '');
      var showFutureCard = attributes.showFutureCard !== false;
      var primaryUrl = attr(attributes, 'primaryUrl');
      var primaryUrlHelp = isHttpsUrl(primaryUrl)
        ? __('Only HTTPS URLs are accepted on the frontend.', 'farmtree')
        : __('Enter a full HTTPS URL. The approved default URL will render until this is valid.', 'farmtree');

      return el(Fragment, {},
        el(InspectorControls, {},
          el(PanelBody, { title: __('Hero content', 'farmtree'), initialOpen: true },
            textControl(__('Kicker', 'farmtree'), 'kicker', attributes, setAttributes),
            textControl(__('Headline', 'farmtree'), 'title', attributes, setAttributes),
            el(TextareaControl, {
              label: __('Supporting text', 'farmtree'),
              value: attr(attributes, 'text'),
              rows: 4,
              onChange: function (value) {
                setTextAttribute(setAttributes, 'text', value);
              }
            })
          ),
          el(PanelBody, { title: __('Background media', 'farmtree'), initialOpen: false },
            mediaUrl ? el('img', {
              className: 'ft-editor-selected-image',
              src: mediaUrl,
              alt: attr(attributes, 'mediaAlt')
            }) : null,
            renderMediaControl(attributes, setAttributes, mediaUrl),
            textControl(__('Image alt text', 'farmtree'), 'mediaAlt', attributes, setAttributes, __('Describe the visible image for accessibility.', 'farmtree'))
          ),
          el(PanelBody, { title: __('Calls to action', 'farmtree'), initialOpen: false },
            textControl(__('Primary CTA label', 'farmtree'), 'primaryText', attributes, setAttributes),
            textControl(__('Primary CTA URL', 'farmtree'), 'primaryUrl', attributes, setAttributes, primaryUrlHelp),
            !isHttpsUrl(primaryUrl) ? el(Notice, { status: 'warning', isDismissible: false },
              __('Frontend rendering falls back to the approved HTTPS URL until this field starts with https://.', 'farmtree')
            ) : null,
            textControl(__('Secondary CTA label', 'farmtree'), 'secondaryText', attributes, setAttributes),
            el(ToggleControl, {
              label: __('Show future service card', 'farmtree'),
              checked: showFutureCard,
              onChange: function (value) {
                setAttributes({ showFutureCard: !!value });
              }
            }),
            showFutureCard ? textControl(__('Future card label', 'farmtree'), 'futureLabel', attributes, setAttributes) : null,
            showFutureCard ? textControl(__('Future card title', 'farmtree'), 'futureTitle', attributes, setAttributes) : null,
            showFutureCard ? el(TextareaControl, {
              label: __('Future card text', 'farmtree'),
              value: attr(attributes, 'futureText'),
              rows: 3,
              onChange: function (value) {
                setTextAttribute(setAttributes, 'futureText', value);
              }
            }) : null
          )
        ),
        el('div', { className: 'ft-editor-lock-note' },
          el(Notice, { status: 'info', isDismissible: false },
            __('Design is locked to the approved FarmTree hero. Edit content and media only.', 'farmtree')
          )
        ),
        el('section', { className: 'page active ft-editor-homepage-hero-preview' },
          el('div', { className: 'hero' },
            mediaUrl ? el('img', { className: 'hero-img', src: mediaUrl, alt: attr(attributes, 'mediaAlt') }) : null,
            el('div', { className: 'green-blob' }),
            el('button', { type: 'button', className: 'arrow-side left', disabled: true }, '‹'),
            el('button', { type: 'button', className: 'arrow-side right', disabled: true }, '›'),
            el('div', { className: 'hero-content' },
              richText('div', 'kicker', __('Kicker', 'farmtree'), 'kicker', attributes, setAttributes),
              richText('h1', '', __('Headline', 'farmtree'), 'title', attributes, setAttributes),
              richText('p', '', __('Supporting text', 'farmtree'), 'text', attributes, setAttributes),
              el('div', { className: 'ft-hero-cta-row' },
                el('span', { className: 'cta-link' }, attr(attributes, 'primaryText')),
                el('span', { className: 'cta-link secondary' }, attr(attributes, 'secondaryText'))
              ),
              showFutureCard ? el('div', { className: 'ft-free-plan-card' },
                richText('span', '', __('Future card label', 'farmtree'), 'futureLabel', attributes, setAttributes),
                richText('strong', '', __('Future card title', 'farmtree'), 'futureTitle', attributes, setAttributes),
                richText('p', '', __('Future card text', 'farmtree'), 'futureText', attributes, setAttributes)
              ) : null
            ),
            el('div', { className: 'hero-controls', role: 'tablist', 'aria-label': 'Hero slides' },
              el('span', { className: 'hero-dot active' }),
              el('span', { className: 'hero-dot' })
            )
          )
        )
      );
    }

    var withHomepageHeroEdit = createHigherOrderComponent(function (BlockEdit) {
      return function FarmTreeHomepageHeroBlockEdit(props) {
        if (!props || props.name !== 'farmtree/homepage-hero') {
          return el(BlockEdit, props);
        }

        return el(HomepageHeroEdit, props);
      };
    }, 'withHomepageHeroEdit');

    addFilter('editor.BlockEdit', 'farmtree/homepage-hero-edit-ui', withHomepageHeroEdit);
  }

  boot();
})();
