import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    class: ['form-group'],
    classNameBindings: ['class', 'hasError'],
    property: '',
    pid: Ember.computed('property', function() {
        if (this.get('property')) return `v-form-group#${this.get('property')}`;
    }),
    valid: Ember.computed.not('message'),
    hasError: Ember.computed.bool('message'),
    didInsertElement() {
        const html  = Ember.$(this.element),
              input = Ember.$('input, textarea, select', html),
              props = this.extractProperties(),
              vForm = this.get('parentView');

        if (input) {
            input.on('focus', this.clearErrors.bind(this));
            input.on('blur', this.revalidate.bind(this));
        }

        if (this.get('hardWatch')) {
            html.on('focusout', this.revalidate.bind(this));
        }
        vForm.get('properties').pushObject({
            pid: this.get('pid'),
            properties: props
        });
        _.each(props, (prop) => {
            vForm.addObserver(`model.${prop}`,this, this.revalidate.bind(this));
        });
    },

    clearErrors() {
        this.set('message', undefined);
    },

    revalidate() {
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
