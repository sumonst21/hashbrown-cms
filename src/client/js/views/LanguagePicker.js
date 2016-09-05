'use strict';

class LanguagePicker extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Event: On change language
     */
    onChangeLanguage(e) {
        e.preventDefault();

        localStorage.setItem('language', $(this).text());

        location.reload();
    }

    render() {
        this.$element = _.div({class: 'language-picker dropdown'});

        if(Array.isArray(this.model) && this.model.length > 1) {
            this.$element.append(
                _.span('Language'),
                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                    window.language,
                    _.span({class: 'fa fa-caret-down'})
                ),
                _.ul({class: 'dropdown-menu'},
                    _.each(
                        this.model.filter((language) => {
                            return language != window.language;
                        }), (i, language) => {
                        return _.li({value: language},
                            _.a({href: '#'},
                                language
                            ).click(this.onChangeLanguage)
                        );
                    })
                )
            );
        
        } else {
            this.$element.remove();
        
        }
    }
}

module.exports = LanguagePicker;