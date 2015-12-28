import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    class: 'form-group',
    errorClass: 'has-error',
    classNameBindings: ['class', 'error'],
    property: '',
    pid: Ember.computed('property', function() {
        if (this.get('property')) return `v-form-group#${this.get('property')}`;
    }),
    error: Ember.computed('message', function() {
        if (this.get('message')) return this.get('errorClass');
    }),
    valid: Ember.computed.not('message'),
    inValid: Ember.computed.bool('message'),
    didInsertElement() {
        const html  = Ember.$(this.element),
              input = Ember.$('input, textarea, select', html),
              props = this.extractProperties(),
              vForm = this.get('parentView');

        if (input) {
            input.on('focus', () => this.clearErrors());
            input.on('blur', () => this.revalidate());
        }

        if (this.get('hardWatch')) {
            html.on('focusout', () => this.revalidate());
        }
        vForm.get('properties').pushObject({
            pid: this.get('pid'),
            properties: props
        });
        _.each(props, (prop) => {
            vForm.addObserver(`model.${prop}`, this, () => this.revalidate());
        });
    },

    clearErrors() {
        this.set('message', undefined);
    },

    revalidate() {
        this.clearErrors();
        const prop     = this.get('property'),
              message  = this.get('parentView').validateProperty(prop);
        if (message) this.set('message', message);
    },

    extractProperties() {
        let properties = [this.get('property')];
        const subproperties = properties[0].match(/\[[a-z, ]+\]/i);
        if (subproperties) {
            const [parentProp, childProps] = properties[0].split('.');
            properties = _.map(_.words(subproperties[0], /\w+/g), word => {
                if (childProps) return `${parentProp}.${word}`;
                return word;
            });
        }

        return properties;
    }
});
