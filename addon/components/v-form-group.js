import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
    tagName: 'div',
    class: 'form-group',
    errorClass: 'has-error',
    classNameBindings: ['class', 'error'],
    property: '',

    error: Ember.computed('message', function() {
        if (this.get('message')) return this.get('errorClass');
    }),

    init() {
        this.set('elementId', `v-form-group#${this.get('property')}`);
        this._super(...arguments);
    },

    didInsertElement() {
        const props = this.extractProperties(),
              vForm = this.get('parentView');

        vForm.get('properties').pushObject({
            elementId: this.get('elementId'),
            properties: props
        });
        _.each(props, (prop) => {
            vForm.addObserver(`model.${prop}`, this, () => this.revalidate());
        });
    },

    focusIn() {
        this.clearErrors();
    },

    focusOut() {
        this.revalidate();
    },

    clearErrors() {
        this.set('message', undefined);
    },

    revalidate() {
        this.clearErrors();
        const message  = this.get('parentView').validateProperty(this.get('elementId'));
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
